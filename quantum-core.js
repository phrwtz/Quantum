((root, factory) => {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.QuantumCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const EPSILON = 1e-12;
  const INV_SQRT2 = 1 / Math.sqrt(2);

  function complex(value = 0, im = 0) {
    if (Array.isArray(value)) {
      return complex(value[0], value[1]);
    }
    if (value && typeof value === "object") {
      return {
        re: Number.isFinite(value.re) ? value.re : 0,
        im: Number.isFinite(value.im) ? value.im : 0,
      };
    }
    return {
      re: Number.isFinite(value) ? value : 0,
      im: Number.isFinite(im) ? im : 0,
    };
  }

  function add(a, b) {
    const left = complex(a);
    const right = complex(b);
    return { re: left.re + right.re, im: left.im + right.im };
  }

  function multiply(a, b) {
    const left = complex(a);
    const right = complex(b);
    return {
      re: left.re * right.re - left.im * right.im,
      im: left.re * right.im + left.im * right.re,
    };
  }

  function scale(value, scalar) {
    const entry = complex(value);
    return { re: entry.re * scalar, im: entry.im * scalar };
  }

  function magnitudeSquared(value) {
    const entry = complex(value);
    return entry.re * entry.re + entry.im * entry.im;
  }

  function cleanComplex(value, tolerance = EPSILON) {
    const entry = complex(value);
    return {
      re: Math.abs(entry.re) < tolerance ? 0 : entry.re,
      im: Math.abs(entry.im) < tolerance ? 0 : entry.im,
    };
  }

  function assertQubitIndex(numQubits, qubitIndex) {
    if (
      !Number.isInteger(numQubits) ||
      numQubits < 1 ||
      !Number.isInteger(qubitIndex) ||
      qubitIndex < 0 ||
      qubitIndex >= numQubits
    ) {
      throw new RangeError(`Invalid qubit index ${qubitIndex}`);
    }
  }

  function basisSize(numQubits) {
    if (!Number.isInteger(numQubits) || numQubits < 1 || numQubits > 16) {
      throw new RangeError("numQubits must be an integer from 1 to 16");
    }
    return 2 ** numQubits;
  }

  function normalizeAmplitudes(amplitudes, fallbackLength = 2) {
    const source = Array.isArray(amplitudes) ? amplitudes : [];
    const targetLength = Math.max(1, fallbackLength);
    const values = Array.from({ length: targetLength }, (_, index) =>
      complex(source[index] || 0),
    );
    const total = values.reduce(
      (sum, entry) => sum + magnitudeSquared(entry),
      0,
    );
    if (!Number.isFinite(total) || total <= EPSILON) {
      return values.map((_, index) => complex(index === 0 ? 1 : 0));
    }
    const norm = Math.sqrt(total);
    return values.map((entry) => cleanComplex(scale(entry, 1 / norm)));
  }

  function createRegister(numQubits, amplitudes = null) {
    const size = basisSize(numQubits);
    return {
      numQubits,
      amplitudes: normalizeAmplitudes(amplitudes, size),
    };
  }

  function createBasisRegister(numQubits, basisIndex = 0) {
    const size = basisSize(numQubits);
    const amplitudes = Array.from({ length: size }, (_, index) =>
      complex(index === basisIndex ? 1 : 0),
    );
    return createRegister(numQubits, amplitudes);
  }

  function createQubit(vector = [1, 0]) {
    return createRegister(1, vector);
  }

  function cloneRegister(register) {
    return createRegister(register.numQubits, register.amplitudes);
  }

  function tensorProductRegisters(registers) {
    const source = Array.isArray(registers) ? registers : [];
    if (!source.length) {
      throw new Error("At least one register is required");
    }
    let amplitudes = [complex(1)];
    let numQubits = 0;
    source.forEach((register) => {
      if (!register || !Number.isInteger(register.numQubits)) {
        throw new Error("Invalid register");
      }
      const normalized = createRegister(register.numQubits, register.amplitudes);
      const next = [];
      amplitudes.forEach((left) => {
        normalized.amplitudes.forEach((right) => {
          next.push(multiply(left, right));
        });
      });
      amplitudes = next;
      numQubits += normalized.numQubits;
    });
    return createRegister(numQubits, amplitudes);
  }

  function productRegister(qubitVectors) {
    const registers = (Array.isArray(qubitVectors) ? qubitVectors : []).map(
      (vector) => createQubit(vector),
    );
    return tensorProductRegisters(registers);
  }

  function bitMaskForQubit(numQubits, qubitIndex) {
    assertQubitIndex(numQubits, qubitIndex);
    return 1 << (numQubits - qubitIndex - 1);
  }

  function bitValue(index, numQubits, qubitIndex) {
    return (index & bitMaskForQubit(numQubits, qubitIndex)) ? 1 : 0;
  }

  function basisLabel(index, numQubits) {
    return index.toString(2).padStart(numQubits, "0");
  }

  function applySingleQubitGate(register, qubitIndex, matrix) {
    const source = cloneRegister(register);
    assertQubitIndex(source.numQubits, qubitIndex);
    if (
      !Array.isArray(matrix) ||
      matrix.length !== 2 ||
      !Array.isArray(matrix[0]) ||
      !Array.isArray(matrix[1])
    ) {
      throw new Error("Single-qubit gate matrix must be 2x2");
    }
    const size = basisSize(source.numQubits);
    const out = Array.from({ length: size }, () => complex(0));
    const mask = bitMaskForQubit(source.numQubits, qubitIndex);
    for (let base = 0; base < size; base += 1) {
      if (base & mask) {
        continue;
      }
      const zeroIndex = base;
      const oneIndex = base | mask;
      const zeroAmplitude = source.amplitudes[zeroIndex];
      const oneAmplitude = source.amplitudes[oneIndex];
      out[zeroIndex] = add(
        multiply(matrix[0][0], zeroAmplitude),
        multiply(matrix[0][1], oneAmplitude),
      );
      out[oneIndex] = add(
        multiply(matrix[1][0], zeroAmplitude),
        multiply(matrix[1][1], oneAmplitude),
      );
    }
    return createRegister(source.numQubits, out);
  }

  function applyControlledGate(
    register,
    controlIndex,
    targetIndex,
    targetMatrix = gateMatrices.X,
  ) {
    const source = cloneRegister(register);
    assertQubitIndex(source.numQubits, controlIndex);
    assertQubitIndex(source.numQubits, targetIndex);
    if (controlIndex === targetIndex) {
      throw new Error("Control and target qubits must be different");
    }
    const size = basisSize(source.numQubits);
    const out = Array.from({ length: size }, () => complex(0));
    const targetMask = bitMaskForQubit(source.numQubits, targetIndex);
    for (let base = 0; base < size; base += 1) {
      if ((base & targetMask) || bitValue(base, source.numQubits, controlIndex) !== 1) {
        if (bitValue(base, source.numQubits, controlIndex) !== 1) {
          out[base] = add(out[base], source.amplitudes[base]);
        }
        continue;
      }
      const zeroIndex = base;
      const oneIndex = base | targetMask;
      const zeroAmplitude = source.amplitudes[zeroIndex];
      const oneAmplitude = source.amplitudes[oneIndex];
      out[zeroIndex] = add(
        out[zeroIndex],
        add(
          multiply(targetMatrix[0][0], zeroAmplitude),
          multiply(targetMatrix[0][1], oneAmplitude),
        ),
      );
      out[oneIndex] = add(
        out[oneIndex],
        add(
          multiply(targetMatrix[1][0], zeroAmplitude),
          multiply(targetMatrix[1][1], oneAmplitude),
        ),
      );
    }
    return createRegister(source.numQubits, out);
  }

  function applyCnot(register, controlIndex, targetIndex) {
    return applyControlledGate(register, controlIndex, targetIndex, gateMatrices.X);
  }

  function marginalProbabilities(register, qubitIndex) {
    const source = cloneRegister(register);
    assertQubitIndex(source.numQubits, qubitIndex);
    return source.amplitudes.reduce(
      (probabilities, amplitude, index) => {
        const key = bitValue(index, source.numQubits, qubitIndex) ? "red" : "blue";
        probabilities[key] += magnitudeSquared(amplitude);
        return probabilities;
      },
      { blue: 0, red: 0 },
    );
  }

  function measureQubit(register, qubitIndex, randomValue = Math.random()) {
    const source = cloneRegister(register);
    const marginal = marginalProbabilities(source, qubitIndex);
    const blueProbability = marginal.blue;
    const outcome = randomValue < blueProbability ? 0 : 1;
    const collapsed = source.amplitudes.map((amplitude, index) =>
      bitValue(index, source.numQubits, qubitIndex) === outcome
        ? amplitude
        : complex(0),
    );
    return {
      outcome,
      color: outcome === 0 ? "blue" : "red",
      probability: outcome === 0 ? marginal.blue : marginal.red,
      register: createRegister(source.numQubits, collapsed),
    };
  }

  function matrixIdentity(size) {
    return Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, column) =>
        complex(row === column ? 1 : 0),
      ),
    );
  }

  function matrixForSingleQubitGate(numQubits, qubitIndex, matrix) {
    const size = basisSize(numQubits);
    assertQubitIndex(numQubits, qubitIndex);
    const result = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => complex(0)),
    );
    const mask = bitMaskForQubit(numQubits, qubitIndex);
    for (let base = 0; base < size; base += 1) {
      if (base & mask) {
        continue;
      }
      const zeroIndex = base;
      const oneIndex = base | mask;
      result[zeroIndex][zeroIndex] = complex(matrix[0][0]);
      result[zeroIndex][oneIndex] = complex(matrix[0][1]);
      result[oneIndex][zeroIndex] = complex(matrix[1][0]);
      result[oneIndex][oneIndex] = complex(matrix[1][1]);
    }
    return result;
  }

  function matrixForCnot(numQubits, controlIndex, targetIndex) {
    const size = basisSize(numQubits);
    assertQubitIndex(numQubits, controlIndex);
    assertQubitIndex(numQubits, targetIndex);
    if (controlIndex === targetIndex) {
      throw new Error("Control and target qubits must be different");
    }
    const targetMask = bitMaskForQubit(numQubits, targetIndex);
    return Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, column) => {
        const mapped =
          bitValue(column, numQubits, controlIndex) === 1
            ? column ^ targetMask
            : column;
        return complex(mapped === row ? 1 : 0);
      }),
    );
  }

  function ketTerms(register, tolerance = 1e-10) {
    const source = cloneRegister(register);
    return source.amplitudes
      .map((amplitude, index) => ({
        basis: basisLabel(index, source.numQubits),
        amplitude: cleanComplex(amplitude),
        probability: magnitudeSquared(amplitude),
      }))
      .filter(
        (term) =>
          term.probability > tolerance ||
          Math.abs(term.amplitude.re) > tolerance ||
          Math.abs(term.amplitude.im) > tolerance,
      );
  }

  const gateMatrices = {
    I: [
      [complex(1), complex(0)],
      [complex(0), complex(1)],
    ],
    X: [
      [complex(0), complex(1)],
      [complex(1), complex(0)],
    ],
    Y: [
      [complex(0), complex(0, -1)],
      [complex(0, 1), complex(0)],
    ],
    Z: [
      [complex(1), complex(0)],
      [complex(0), complex(-1)],
    ],
    H: [
      [complex(INV_SQRT2), complex(INV_SQRT2)],
      [complex(INV_SQRT2), complex(-INV_SQRT2)],
    ],
    S: [
      [complex(1), complex(0)],
      [complex(0), complex(0, 1)],
    ],
    T: [
      [complex(1), complex(0)],
      [complex(0), complex(INV_SQRT2, INV_SQRT2)],
    ],
  };

  return {
    EPSILON,
    add,
    applyCnot,
    applyControlledGate,
    applySingleQubitGate,
    basisLabel,
    bitValue,
    cleanComplex,
    cloneRegister,
    complex,
    createBasisRegister,
    createQubit,
    createRegister,
    gateMatrices,
    ketTerms,
    magnitudeSquared,
    marginalProbabilities,
    matrixForCnot,
    matrixForSingleQubitGate,
    matrixIdentity,
    measureQubit,
    multiply,
    normalizeAmplitudes,
    productRegister,
    tensorProductRegisters,
  };
});
