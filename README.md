I am developing a webapp app that leverages AI-driven facial recognition to track student presence during study sessions. The system utilizes AI to monitor activity through the webcam, analyze screen time patterns, and generate insights for daily, monthly, and yearly performance tracking.

AI plays a crucial role in ensuring accurate detection, real-time monitoring, and intelligent analysis of student engagement. It helps differentiate between active and inactive sessions, minimizes false detections, and enhances authentication security.

Upon accessing the platform, users can register or log in. During registration, they provide a unique ID, user ID, and facial structure for AI-powered authentication, along with creating a password. For login, users can either enter their user ID or email with a password or opt for seamless AI-driven facial recognition authentication.

This AI-integrated system ensures reliable tracking, enhances study accountability, and provides valuable insights into student engagement over time.

1. Develop a program to create histograms for all numerical features and analyze the
distribution of each feature. Generate box plots for all numerical features and identify any
outliers. Use California Housing dataset
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
# Load dataset
housing_df = fetch_california_housing(as_frame=True).frame
# Select numerical features
numerical_features = housing_df.select_dtypes(include=[np.number]).columns
# Plot histograms for numerical features
plt.figure(figsize=(15, 10))
for i, feature in enumerate(numerical_features, 1):
plt.subplot(3, 3, i)
sns.histplot(housing_df[feature], kde=True, bins=30, color='blue')
plt.title(f'Distribution of {feature}')
plt.tight_layout()
plt.show()
# Plot box plots for numerical features
plt.figure(figsize=(15, 10))
for i, feature in enumerate(numerical_features, 1):
plt.subplot(3, 3, i)
sns.boxplot(x=housing_df[feature], color='orange')
plt.title(f'Box Plot of {feature}')
plt.tight_layout()
plt.show()
# Identify outliers using IQR method
print("Outliers Detection:")
outliers_summary = {}
for feature in numerical_features:
Q1 = housing_df[feature].quantile(0.25)
Q3 = housing_df[feature].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
outliers = housing_df[(housing_df[feature] < lower_bound) | (housing_df[feature] >
upper_bound)]
outliers_summary[feature] = len(outliers)
print(f"{feature}: {len(outliers)} outliers")
# Optional: Dataset summary
print("\nDataset Summary:")
print(housing_df.describe())
2. Develop a program to Compute the correlation matrix to understand the relationships
between pairs of features. Visualize the correlation matrix using a heatmap to know which
variables have strong positive/negative correlations. Create a pair plot to visualize pairwise
relationships between features. Use California Housing dataset.
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
# Load California Housing dataset
data = fetch_california_housing(as_frame=True).frame
# Compute correlation matrix
corr_matrix = data.corr()
# Heatmap of correlation matrix
plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f', linewidths=0.5)
plt.title('Correlation Matrix - California Housing')
plt.show()
# Pair plot for selected features (for better visualization performance)
selected_features = ['MedInc', 'HouseAge', 'AveRooms', 'AveOccup', 'MedHouseVal']
sns.pairplot(data[selected_features], diag_kind='kde', plot_kws={'alpha': 0.6})
plt.suptitle('Pair Plot of Selected Features', y=1.02)
plt.show()
3. Develop a program to implement Principal Component Analysis (PCA) for reducing the
dimensionality of the Iris dataset from 4 features to 2.
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
# Load the Iris dataset
iris = load_iris()
X = iris.data
y = iris.target
target_names = iris.target_names
# Apply PCA to reduce dimensionality to 2 components
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
# Create a DataFrame for visualization
df_pca = pd.DataFrame(X_pca, columns=['PC1', 'PC2'])
df_pca['Label'] = y
# Plotting
plt.figure(figsize=(8, 6))
colors = ['r', 'g', 'b']
for i, target in enumerate(np.unique(y)):
subset = df_pca[df_pca['Label'] == target]
plt.scatter(subset['PC1'], subset['PC2'], color=colors[i], label=target_names[target],
alpha=0.7)
plt.title('PCA on Iris Dataset')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
4. For a given set of training data examples stored in a .CSV file, implement and
demonstrate the Find-S algorithm to output a description of the set of all hypotheses
consistent with the training examples.
import pandas as pd
def find_s_algorithm(file_path):
data = pd.read_csv(file_path)
print("Training Data:\n", data)
attributes = data.columns[:-1]
label_col = data.columns[-1]
hypothesis = ['?' for _ in attributes]
for _, row in data.iterrows():
if row[label_col].strip().lower() == 'yes': # Handle case and spaces
for i, attr in enumerate(attributes):
if hypothesis[i] == '?' or hypothesis[i] == row[attr]:
hypothesis[i] = row[attr]
else:
hypothesis[i] = '?'
return hypothesis
# Replace with the actual path to your CSV file
file_path = r"C:\Users\atme\Desktop\example ml\training_data.csv"
final_hypothesis = find_s_algorithm(file_path)
print("\nFinal Hypothesis:", final_hypothesis)
5.Develop a program to implement k-Nearest Neighbour algorithm to classify the randomly
generated 100 values of x in the range of [0,1]. Perform the following based on dataset
generated. a. Label the first 50 points {x1,……,x50} as follows: if (xi ≤ 0.5), then xi ε Class1,
else xi ε Class1 b. Classify the remaining points, x51,……,x100 using KNN. Perform this for
k=1,2,3,4,5,20,30
import numpy as np
import matplotlib.pyplot as plt
from collections import Counter
# Generate random data
data = np.random.rand(100)
# Label first 50 points
train_data = data[:50]
train_labels = ["Class1" if x <= 0.5 else "Class2" for x in train_data]
test_data = data[50:]
# Euclidean distance function
def euclidean_distance(x1, x2):
return abs(x1 - x2)
# k-NN function
def knn_classifier(train_data, train_labels, test_point, k):
distances = sorted([(euclidean_distance(test_point, train_data[i]), train_labels[i])
for i in range(len(train_data))])
k_labels = [label for _, label in distances[:k]]
return Counter(k_labels).most_common(1)[0][0]
# Perform classification for di􀆯erent k values
k_values = [1, 2, 3, 4, 5, 20, 30]
results = {}
print("--- k-Nearest Neighbors Classification ---\n")
for k in k_values:
print(f"Results for k = {k}:")
classified = [knn_classifier(train_data, train_labels, x, k) for x in test_data]
results[k] = classified
for i, label in enumerate(classified, start=51):
print(f"x{i} (value: {test_data[i - 51]:.4f}) -> {label}")
print()
# Visualization
for k in k_values:
class1 = [test_data[i] for i, lbl in enumerate(results[k]) if lbl == "Class1"]
class2 = [test_data[i] for i, lbl in enumerate(results[k]) if lbl == "Class2"]
plt.figure(figsize=(10, 4))
plt.scatter(train_data, [0] * len(train_data),
c=["blue" if l == "Class1" else "red" for l in train_labels], label="Training Data",
marker="o")
plt.scatter(class1, [1] * len(class1), c="blue", label="Class1 (Test)", marker="x")
plt.scatter(class2, [1] * len(class2), c="red", label="Class2 (Test)", marker="x")
plt.title(f"k = {k}")
plt.xlabel("x")
plt.yticks([0, 1], ["Train", "Test"])
plt.legend()
plt.grid(True)
plt.show()
6 .Implement the non-parametric Locally Weighted Regression algorithm in order to fit data points.
Select appropriate data set for your experiment and draw graphs
import numpy as np
import matplotlib.pyplot as plt
# Gaussian kernel
def gaussian_kernel(x, xi, tau):
return np.exp(-np.sum((x - xi) ** 2) / (2 * tau ** 2))
# LWR function
def locally_weighted_regression(x, X, y, tau):
W = np.diag([gaussian_kernel(x, xi, tau) for xi in X])
theta = np.linalg.pinv(X.T @ W @ X) @ (X.T @ W @ y)
return x @ theta
# Generate synthetic data
np.random.seed(42)
X = np.linspace(0, 2 * np.pi, 100)
y = np.sin(X) + 0.1 * np.random.randn(100)
# Add bias term
X_bias = np.c_[np.ones_like(X), X]
x_test = np.linspace(0, 2 * np.pi, 200)
x_test_bias = np.c_[np.ones_like(x_test), x_test]
# Set bandwidth
tau = 0.5
# Predict using LWR
y_pred = np.array([locally_weighted_regression(xi, X_bias, y, tau) for xi in x_test_bias])
# Plot results
plt.figure(figsize=(10, 6))
plt.scatter(X, y, color='red', label='Training Data', alpha=0.6)
plt.plot(x_test, y_pred, color='blue', label=f'LWR Fit (tau={tau})', linewidth=2)
plt.xlabel('X')
plt.ylabel('y')
plt.title('Locally Weighted Regression')
plt.legend()
plt.grid(True)
plt.show()
7
. Develop a program to demonstrate the working of Linear Regression and Polynomial
Regression. Use Boston Housing Dataset for Linear Regression and Auto MPG Dataset (for
vehicle fuel efficiency prediction) for Polynomial Regression.
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_squared_error, r2_score
# Linear Regression on California Housing
def linear_regression_california():
data = fetch_california_housing(as_frame=True)
X = data.data[["AveRooms"]]
y = data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
plt.scatter(X_test, y_test, color="blue", label="Actual")
plt.plot(X_test, y_pred, color="red", label="Predicted")
plt.xlabel("Average Rooms")
plt.ylabel("Median House Value")
plt.title("Linear Regression - California Housing")
plt.legend()
plt.show()
print("Linear Regression - California Housing")
print("MSE:", mean_squared_error(y_test, y_pred))
print("R² Score:", r2_score(y_test, y_pred))
# Polynomial Regression on Auto MPG
def polynomial_regression_auto_mpg():
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data"
columns = ["mpg", "cylinders", "displacement", "horsepower", "weight",
"acceleration", "model_year", "origin", "car_name"]
df = pd.read_csv(url, delim_whitespace=True, names=columns, na_values="?")
df = df.dropna()
X = df["displacement"].values.reshape(-1, 1)
y = df["mpg"].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = make_pipeline(PolynomialFeatures(2), StandardScaler(), LinearRegression())
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
plt.scatter(X_test, y_test, color="blue", label="Actual", alpha=0.6)
plt.scatter(X_test, y_pred, color="red", label="Predicted", alpha=0.6)
plt.xlabel("Displacement")
plt.ylabel("MPG")
plt.title("Polynomial Regression - Auto MPG")
plt.legend()
plt.show()
print("Polynomial Regression - Auto MPG")
print("MSE:", mean_squared_error(y_test, y_pred))
print("R² Score:", r2_score(y_test, y_pred))
# Main
if __name__ == "__main__":
print("Demonstrating Linear & Polynomial Regression\n")
linear_regression_california()
polynomial_regression_auto_mpg()
8. Develop a program to demonstrate the working of the decision tree algorithm. Use Breast
Cancer Data set for building the decision tree and apply this knowledge to classify a new
sample.
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score
# Load data
data = load_breast_cancer()
X, y = data.data, data.target
# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
# Train Decision Tree
clf = DecisionTreeClassifier(random_state=42)
clf.fit(X_train, y_train)
# Accuracy
y_pred = clf.predict(X_test)
print(f"Model Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
# Predict a new sample
sample = X_test[0].reshape(1, -1)
pred = clf.predict(sample)[0]
print("Predicted Class for the new sample:", "Benign" if pred == 1 else "Malignant")
# Plot Decision Tree
plt.figure(figsize=(12, 6))
plot_tree(clf, filled=True, feature_names=data.feature_names, class_names=data.target_names)
plt.title("Decision Tree - Breast Cancer Dataset")
plt.show()
9. Develop a program to implement the Naive Bayesian classifier considering Olivetti Face
Data set for training. Compute the accuracy of the classifier, considering a few test data sets.
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_olivetti_faces
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
# Load the Olivetti Faces dataset
data = fetch_olivetti_faces(shuffle=True, random_state=42)
X, y = data.data, data.target
# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
# Train Naive Bayes classifier
model = GaussianNB()
model.fit(X_train, y_train)
# Predictions and evaluation
y_pred = model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%')
print("\nClassification Report:\n", classification_report(y_test, y_pred, zero_division=1))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
# Cross-validation
cv_score = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f'\nCross-validation Accuracy: {cv_score.mean() * 100:.2f}%')
# Show sample predictions
fig, axes = plt.subplots(3, 5, figsize=(12, 8))
for ax, img, true, pred in zip(axes.ravel(), X_test, y_test, y_pred):
ax.imshow(img.reshape(64, 64), cmap='gray')
ax.set_title(f"True: {true}, Pred: {pred}")
ax.axis('off')
plt.tight_layout()
plt.show()
10. Develop a program to implement k-means clustering using Wisconsin Breast Cancer data
set and visualize the clustering result.
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_breast_cancer
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import confusion_matrix, classification_report
# Load dataset
data = load_breast_cancer()
X, y = data.data, data.target
# Standardize features
X_scaled = StandardScaler().fit_transform(X)
# Apply K-Means Clustering
kmeans = KMeans(n_clusters=2, random_state=42)
y_kmeans = kmeans.fit_predict(X_scaled)
# Evaluation
print("Confusion Matrix:\n", confusion_matrix(y, y_kmeans))
print("\nClassification Report:\n", classification_report(y, y_kmeans))
# Reduce dimensions for visualization
X_pca = PCA(n_components=2).fit_transform(X_scaled)
df = pd.DataFrame(X_pca, columns=['PC1', 'PC2'])
df['Cluster'] = y_kmeans
df['True Label'] = y
# Plot clustering results
plt.figure(figsize=(8, 6))
sns.scatterplot(data=df, x='PC1', y='PC2', hue='Cluster', palette='Set1', s=100, edgecolor='black',
alpha=0.7)
plt.title('K-Means Clustering Result')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.legend(title="Cluster")
plt.tight_layout()
plt.show()
# Plot actual class labels
plt.figure(figsize=(8, 6))
sns.scatterplot(data=df, x='PC1', y='PC2', hue='True Label', palette='coolwarm', s=100,
edgecolor='black', alpha=0.7)
plt.title('True Class Labels')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.legend(title="True Label")
plt.tight_layout()
plt.show()
