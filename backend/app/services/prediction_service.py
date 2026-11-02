from typing import Sequence

import numpy as np
from sklearn.linear_model import LinearRegression


def predict_next_month(expenses: Sequence[float]) -> float:
    if not expenses:
        return 0.0

    if len(expenses) == 1:
        return float(expenses[0])

    x = np.arange(1, len(expenses) + 1).reshape(-1, 1)

    y = np.array(expenses, dtype=float)

    model = LinearRegression()

    model.fit(x, y)

    next_month = np.array([[len(expenses) + 1]])

    prediction = model.predict(next_month)[0]

    return max(float(prediction), 0.0)