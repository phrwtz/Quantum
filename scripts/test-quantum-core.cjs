const assert = require("node:assert/strict");
const QuantumCore = require("../quantum-core.js");

const {
  add,
  applyCnot,
  applySingleQubitGate,
  basisLabel,
  bitValue,
  createBasisRegister,
  createQubit,
  createRegister,
  gateMatrices,
  ketTerms,
  magnitudeSquared,
  marginalProbabilities,
  matrixForCnot,
  matrixForSingleQubitGate,
  measureQubit,
  multiply,
  productRegister,
} = QuantumCore;

const EPS = 1e-9;

function nearly(actual, expected, tolerance = EPS) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be close to ${expected}`,
  );
}

function amplitude(register, basis) {
  const index = Number.parseInt(basis, 2);
  return register.amplitudes[index] || { re: 0, im: 0 };
}

function probability(register, basis) {
  const entry = amplitude(register, basis);
  return entry.re * entry.re + entry.im * entry.im;
}

function assertBasisProbability(register, basis, expected) {
  nearly(probability(register, basis), expected);
}

function assertOnlyBasis(register, basis) {
  register.amplitudes.forEach((entry, index) => {
    const expected = basisLabel(index, register.numQubits) === basis ? 1 : 0;
    nearly(entry.re, expected);
    nearly(entry.im, 0);
  });
}

function assertNormalized(register) {
  const total = register.amplitudes.reduce(
    (sum, entry) => sum + entry.re * entry.re + entry.im * entry.im,
    0,
  );
  nearly(total, 1);
}

function conjugate(value) {
  return { re: value.re, im: -value.im };
}

function qubitVectorForFixedBits(register, targetIndex, fixedBits) {
  const vector = [
    { re: 0, im: 0 },
    { re: 0, im: 0 },
  ];
  register.amplitudes.forEach((entry, index) => {
    const matches = Object.entries(fixedBits).every(
      ([qubitKey, bit]) =>
        bitValue(index, register.numQubits, Number(qubitKey)) === bit,
    );
    if (!matches) {
      return;
    }
    const targetBit = bitValue(index, register.numQubits, targetIndex);
    vector[targetBit] = add(vector[targetBit], entry);
  });
  return createQubit(vector).amplitudes;
}

function qubitFidelity(expectedVector, actualVector) {
  const expected = createQubit(expectedVector).amplitudes;
  const actual = createQubit(actualVector).amplitudes;
  const overlap = add(
    multiply(conjugate(expected[0]), actual[0]),
    multiply(conjugate(expected[1]), actual[1]),
  );
  return magnitudeSquared(overlap);
}

{
  const flipped = applySingleQubitGate(
    createBasisRegister(1, 0),
    0,
    gateMatrices.X,
  );
  assertOnlyBasis(flipped, "1");
}

{
  const phased = applySingleQubitGate(
    applySingleQubitGate(createBasisRegister(1, 0), 0, gateMatrices.H),
    0,
    gateMatrices.Z,
  );
  nearly(amplitude(phased, "0").re, 1 / Math.sqrt(2));
  nearly(amplitude(phased, "1").re, -1 / Math.sqrt(2));
  assertNormalized(phased);
}

{
  const yOnZero = applySingleQubitGate(createBasisRegister(1, 0), 0, gateMatrices.Y);
  nearly(amplitude(yOnZero, "0").re, 0);
  nearly(amplitude(yOnZero, "0").im, 0);
  nearly(amplitude(yOnZero, "1").re, 0);
  nearly(amplitude(yOnZero, "1").im, 1);

  const sOnOne = applySingleQubitGate(createBasisRegister(1, 1), 0, gateMatrices.S);
  nearly(amplitude(sOnOne, "1").re, 0);
  nearly(amplitude(sOnOne, "1").im, 1);

  const tOnOne = applySingleQubitGate(createBasisRegister(1, 1), 0, gateMatrices.T);
  nearly(amplitude(tOnOne, "1").re, 1 / Math.sqrt(2));
  nearly(amplitude(tOnOne, "1").im, 1 / Math.sqrt(2));
  assertNormalized(tOnOne);
}

{
  const source = createBasisRegister(2, 2); // |10>
  const after = applyCnot(source, 0, 1);
  assertOnlyBasis(after, "11");
}

{
  const bell = applyCnot(
    applySingleQubitGate(createBasisRegister(2, 0), 0, gateMatrices.H),
    0,
    1,
  );
  assertBasisProbability(bell, "00", 0.5);
  assertBasisProbability(bell, "11", 0.5);
  assertBasisProbability(bell, "01", 0);
  assertBasisProbability(bell, "10", 0);
  nearly(marginalProbabilities(bell, 0).blue, 0.5);
  nearly(marginalProbabilities(bell, 1).red, 0.5);
  const measured = measureQubit(bell, 0, 0.1);
  assert.equal(measured.color, "blue");
  assertOnlyBasis(measured.register, "00");
}

{
  const register = productRegister([
    [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
    [1, 0],
    [1, 0],
  ]);
  const withBellPair = applyCnot(
    applySingleQubitGate(register, 1, gateMatrices.H),
    1,
    2,
  );
  const aliceEntangles = applyCnot(withBellPair, 0, 1);
  const aliceHadamard = applySingleQubitGate(
    aliceEntangles,
    0,
    gateMatrices.H,
  );
  assert.equal(aliceHadamard.numQubits, 3);
  assert.equal(aliceHadamard.amplitudes.length, 8);
  assertNormalized(aliceHadamard);
  const terms = ketTerms(aliceHadamard);
  assert.ok(terms.length > 1, "3-qubit teleportation setup should superpose");
}

{
  const rootHalf = Math.SQRT1_2;
  const messageVectors = [
    [rootHalf, rootHalf],
    [rootHalf, -rootHalf],
    [Math.sqrt(0.8), Math.sqrt(0.2)],
    [0, 1],
  ];
  const aliceRandoms = [
    [0.1, 0.1],
    [0.1, 0.9],
    [0.9, 0.1],
    [0.9, 0.9],
  ];

  messageVectors.forEach((messageVector) => {
    aliceRandoms.forEach(([sourceRandom, pairRandom]) => {
      let register = productRegister([messageVector, [1, 0], [1, 0]]);
      register = applySingleQubitGate(register, 1, gateMatrices.H);
      register = applyCnot(register, 1, 2);
      register = applyCnot(register, 0, 1);
      register = applySingleQubitGate(register, 0, gateMatrices.H);
      const sourceMeasurement = measureQubit(register, 0, sourceRandom);
      const pairMeasurement = measureQubit(
        sourceMeasurement.register,
        1,
        pairRandom,
      );
      register = pairMeasurement.register;
      if (pairMeasurement.outcome === 1) {
        register = applySingleQubitGate(register, 2, gateMatrices.X);
      }
      if (sourceMeasurement.outcome === 1) {
        register = applySingleQubitGate(register, 2, gateMatrices.Z);
      }
      const bobVector = qubitVectorForFixedBits(register, 2, {
        0: sourceMeasurement.outcome,
        1: pairMeasurement.outcome,
      });
      nearly(qubitFidelity(messageVector, bobVector), 1);
      assertNormalized(register);
    });
  });
}

{
  const register = createRegister(3);
  const hOnMiddle = matrixForSingleQubitGate(
    register.numQubits,
    1,
    gateMatrices.H,
  );
  const cnot = matrixForCnot(register.numQubits, 0, 2);
  assert.equal(hOnMiddle.length, 8);
  assert.equal(hOnMiddle[0].length, 8);
  assert.equal(cnot.length, 8);
  assert.equal(cnot[0].length, 8);
  nearly(hOnMiddle[0][0].re, 1 / Math.sqrt(2));
  assert.equal(cnot[5][4].re, 1); // |100> maps to |101>
}

console.log("quantum-core tests passed");
