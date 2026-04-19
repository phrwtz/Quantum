"""Core mathematical primitives for the Quantum UI.

This module is intentionally separate from the browser UI so we can build
and test quantum-state behavior independently.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import reduce
import os
from typing import Iterable

# Keep runtime caches in writable locations when environment defaults are restricted.
os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba-cache")
os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib")

import cirq
import jax
import jax.numpy as jnp
import numpy as np
import qiskit
import qutip as qt
import quimb
import scipy as sp
import scipy.linalg as spla
import sympy as sym
from qiskit import quantum_info as qi

# Keep this mapping aligned with the current UI tick model.
_BLUE_RED_MIX_BY_TICK: dict[int, tuple[float, float]] = {
    0: (1.0, 0.0),
    1: (5 / 6, 1 / 6),
    2: (2 / 3, 1 / 3),
    3: (1 / 2, 1 / 2),
    4: (1 / 3, 2 / 3),
    5: (1 / 6, 5 / 6),
    6: (0.0, 1.0),
    7: (1 / 6, 5 / 6),
    8: (1 / 3, 2 / 3),
    9: (1 / 2, 1 / 2),
    10: (2 / 3, 1 / 3),
    11: (5 / 6, 1 / 6),
}

# One-qubit UI button model:
# index 0 -> P(0)=1
# index 1 -> P(0)=3/4
# index 2 -> P(0)=1/2
# index 3 -> P(0)=1/4
# index 4 -> P(0)=0
_ONE_QUBIT_BUTTON_BLUE_PROBABILITIES: tuple[float, ...] = (1.0, 3 / 4, 1 / 2, 1 / 4, 0.0)


def as_complex_vector(values: Iterable[complex]) -> np.ndarray:
    """Return a 1D complex vector."""
    vector = np.asarray(list(values), dtype=np.complex128).reshape(-1)
    if vector.size == 0:
        raise ValueError("State vector must have at least one component.")
    return vector


def normalize_state(vector: Iterable[complex]) -> np.ndarray:
    """Normalize a state vector to unit norm."""
    state = as_complex_vector(vector)
    norm = np.linalg.norm(state)
    if not np.isfinite(norm) or norm <= 1e-12:
        raise ValueError("State vector must have non-zero finite norm.")
    return state / norm


def measurement_probabilities(vector: Iterable[complex]) -> np.ndarray:
    """Return computational-basis probabilities from amplitudes.

    For a single qubit [a, b], this returns [|a|^2, |b|^2].
    """
    state = normalize_state(vector)
    probs = np.abs(state) ** 2
    return probs / probs.sum()


def sample_measurement(
    vector: Iterable[complex],
    rng: np.random.Generator | None = None,
) -> tuple[int, np.ndarray]:
    """Sample one computational-basis measurement and return collapsed state."""
    probs = measurement_probabilities(vector)
    generator = rng or np.random.default_rng()
    outcome = int(generator.choice(len(probs), p=probs))
    collapsed = np.zeros_like(probs, dtype=np.complex128)
    collapsed[outcome] = 1.0 + 0.0j
    return outcome, collapsed


def is_unitary(matrix: Iterable[Iterable[complex]], atol: float = 1e-9) -> bool:
    """Check whether a matrix is unitary."""
    mat = np.asarray(matrix, dtype=np.complex128)
    if mat.ndim != 2 or mat.shape[0] != mat.shape[1]:
        return False
    identity = np.eye(mat.shape[0], dtype=np.complex128)
    return np.allclose(mat.conj().T @ mat, identity, atol=atol)


def apply_gate(
    vector: Iterable[complex],
    matrix: Iterable[Iterable[complex]],
) -> np.ndarray:
    """Apply a gate matrix using row-vector convention: state @ gate."""
    state = normalize_state(vector)
    gate = np.asarray(matrix, dtype=np.complex128)
    if gate.shape != (state.size, state.size):
        raise ValueError(
            f"Gate shape {gate.shape} does not match state dimension {state.size}."
        )
    if not is_unitary(gate):
        raise ValueError("Gate matrix must be unitary.")
    return normalize_state(state @ gate)


def tensor_product(*vectors_or_matrices: Iterable[complex]) -> np.ndarray:
    """Kronecker product of vectors/matrices."""
    arrays = [np.asarray(item, dtype=np.complex128) for item in vectors_or_matrices]
    if not arrays:
        raise ValueError("Provide at least one operand for tensor product.")
    return reduce(np.kron, arrays)


@dataclass(frozen=True)
class SingleQubitGate:
    """A validated 2x2 unitary gate."""

    matrix: np.ndarray
    label: str = "U"

    def __post_init__(self) -> None:
        matrix = np.asarray(self.matrix, dtype=np.complex128)
        if matrix.shape != (2, 2):
            raise ValueError(f"SingleQubitGate requires shape (2, 2), got {matrix.shape}.")
        if not is_unitary(matrix):
            raise ValueError("SingleQubitGate matrix must be unitary.")
        object.__setattr__(self, "matrix", matrix)

    def apply(self, vector: Iterable[complex]) -> np.ndarray:
        """Apply this gate to a qubit state vector."""
        return apply_gate(vector, self.matrix)


def gate_matrix_from_tick(tick: int) -> np.ndarray:
    """Construct the UI-compatible 2x2 unitary gate matrix from a tick index."""
    normalized_tick = tick % 12
    blue_weight, red_weight = _BLUE_RED_MIX_BY_TICK[normalized_tick]
    blue_amp = np.sqrt(blue_weight)
    red_amp = np.sqrt(red_weight)
    # Preserve the current UI sign convention for ticks 7-11.
    blue_sign = -1.0 if 7 <= normalized_tick <= 11 else 1.0
    a = blue_sign * blue_amp
    b = red_amp
    return np.array([[a, b], [-b, a]], dtype=np.complex128)


def gate_matrix_from_button(index: int) -> np.ndarray:
    """Construct the one-qubit UI gate matrix from a button index.

    This uses the current UI convention:
    button 0: P(0)=1, button 1: P(0)=3/4, button 2: P(0)=1/2,
    button 3: P(0)=1/4, button 4: P(0)=0 for blue input |0>.
    """
    normalized_index = index % len(_ONE_QUBIT_BUTTON_BLUE_PROBABILITIES)
    blue_probability = _ONE_QUBIT_BUTTON_BLUE_PROBABILITIES[normalized_index]
    red_probability = 1.0 - blue_probability
    a = np.sqrt(blue_probability)
    b = np.sqrt(red_probability)
    return np.array([[a, b], [-b, a]], dtype=np.complex128)


def gate_from_tick(tick: int) -> SingleQubitGate:
    """Return a validated gate object from a tick index."""
    return SingleQubitGate(matrix=gate_matrix_from_tick(tick), label=f"tick-{tick % 12}")


def gate_from_button(index: int) -> SingleQubitGate:
    """Return a validated gate object from a one-qubit UI button index."""
    normalized_index = index % len(_ONE_QUBIT_BUTTON_BLUE_PROBABILITIES)
    return SingleQubitGate(
        matrix=gate_matrix_from_button(normalized_index),
        label=f"button-{normalized_index}",
    )


def standard_hadamard() -> SingleQubitGate:
    """Return the canonical Hadamard gate."""
    scale = 1 / np.sqrt(2)
    return SingleQubitGate(
        matrix=np.array([[scale, scale], [scale, -scale]], dtype=np.complex128),
        label="H",
    )


def to_qutip_ket(vector: Iterable[complex]) -> qt.Qobj:
    """Convert to a QuTiP ket object."""
    state = normalize_state(vector)
    return qt.Qobj(state.reshape((state.size, 1)), dims=[[state.size], [1]])


def to_qiskit_statevector(vector: Iterable[complex]) -> qi.Statevector:
    """Convert to a Qiskit Statevector object."""
    return qi.Statevector(normalize_state(vector))


def to_sympy_column(vector: Iterable[complex]) -> sym.Matrix:
    """Convert to a SymPy column matrix."""
    state = normalize_state(vector)
    return sym.Matrix(state.reshape((state.size, 1)))


__all__ = [
    "SingleQubitGate",
    "apply_gate",
    "as_complex_vector",
    "gate_from_button",
    "gate_from_tick",
    "gate_matrix_from_button",
    "gate_matrix_from_tick",
    "is_unitary",
    "measurement_probabilities",
    "normalize_state",
    "sample_measurement",
    "standard_hadamard",
    "tensor_product",
    "to_qiskit_statevector",
    "to_qutip_ket",
    "to_sympy_column",
]
