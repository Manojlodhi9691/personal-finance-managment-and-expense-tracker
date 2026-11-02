import numpy as np

from sklearn.linear_model import LinearRegression


def train_model():
    months = np.array(
        [1, 2, 3, 4, 5, 6]
    ).reshape(-1, 1)

    expenses = np.array(
        [14000, 14500, 15200, 16000, 16500, 17200]
    )

    model = LinearRegression()

    model.fit(months, expenses)

    prediction = model.predict([[7]])[0]

    print(
        f"Predicted next month expense: ₹{prediction:.2f}"
    )


if __name__ == "__main__":
    train_model()