import numpy as np

from sklearn.linear_model import LinearRegression


def predict(expenses):
    if len(expenses) < 2:
        return expenses[-1] if expenses else 0

    x = np.arange(
        1,
        len(expenses) + 1,
    ).reshape(-1, 1)

    y = np.array(expenses)

    model = LinearRegression()

    model.fit(x, y)

    prediction = model.predict(
        [[len(expenses) + 1]]
    )

    return max(float(prediction[0]), 0)


if __name__ == "__main__":
    data = [
        14000,
        14500,
        15200,
        16000,
        16500,
        17200,
    ]

    print(
        f"Next month: ₹{predict(data):.2f}"
    )