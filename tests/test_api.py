import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app import app

class TestAPI(unittest.TestCase):

    def test_bfs_endpoint(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [],
                "size": 5,
                "algorithm": "bfs"
            })
        self.assertEqual(response.status_code, 200)

        data = response.get_json()

        self.assertEqual(len(data["path"]), 9)
        self.assertEqual(len(data["explored"]), 25)

    def test_dijkstra_endpoint(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [],
                "size": 5,
                "algorithm": "dijkstra"
            })
        self.assertEqual(response.status_code, 200)

        data = response.get_json()

        self.assertEqual(len(data["path"]), 9)
        self.assertEqual(len(data["explored"]), 25)

    def test_astar_endpoint(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [],
                "size": 5,
                "algorithm": "astar"
            })
        self.assertEqual(response.status_code, 200)

        data = response.get_json()

        self.assertEqual(len(data["path"]), 9)
        self.assertEqual(len(data["explored"]), 9)

    def test_invalid_algorithm(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [],
                "size": 5,
                "algorithm": "dfs"
            })

        self.assertEqual(response.status_code, 400)

        data = response.get_json()

        self.assertIsInstance(data, dict)
        self.assertIn("error", data)
        self.assertIsInstance(data["error"], str)
        self.assertTrue(data["error"].strip())

    def test_invalid_grid_size(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [],
                "size": 7,
                "algorithm": "bfs"
            })

        self.assertEqual(response.status_code, 400)

        data = response.get_json()

        self.assertIsInstance(data, dict)
        self.assertIn("error", data)
        self.assertIsInstance(data["error"], str)
        self.assertTrue(data["error"].strip())

    def test_malformed_json(self):
        with app.test_client() as client:
            response = client.post(
                "/api/bfs",
                data = '{"size": 5, invalid}',
                content_type = "application/json"
            )

        self.assertEqual(response.status_code, 400)

    def test_missing_algorithm(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [],
                "size": 5
            })

        self.assertEqual(response.status_code, 200)

        data = response.get_json()

        self.assertEqual(len(data["path"]), 9)
        self.assertEqual(len(data["explored"]), 25)

    def test_invalid_obstacles_coordinates(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [[5,0]],
                "size": 5,
                "algorithm": "bfs"
            })

        self.assertEqual(response.status_code, 400)

        data = response.get_json()

        self.assertIsInstance(data, dict)
        self.assertIn("error", data)
        self.assertIsInstance(data["error"], str)
        self.assertTrue(data["error"].strip())

    def test_invalid_obstacles_type(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [["abcd", 2]],
                "size": 5,
                "algorithm": "bfs"
            })

        self.assertEqual(response.status_code, 400)

        data = response.get_json()

        self.assertIsInstance(data, dict)
        self.assertIn("error", data)
        self.assertIsInstance(data["error"], str)
        self.assertTrue(data["error"].strip())

    def test_incomplete_obstacles(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [[1]],
                "size": 5,
                "algorithm": "bfs"
            })

        self.assertEqual(response.status_code, 400)

        data = response.get_json()

        self.assertIsInstance(data, dict)
        self.assertIn("error", data)
        self.assertIsInstance(data["error"], str)
        self.assertTrue(data["error"].strip())

    def test_invalid_blocked_field(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": None,
                "size": 5,
                "algorithm": "bfs"
            })

        self.assertEqual(response.status_code, 400)

        data = response.get_json()

        self.assertIsInstance(data, dict)
        self.assertIn("error", data)
        self.assertIsInstance(data["error"], str)
        self.assertTrue(data["error"].strip())

    def test__bfs_with_obstacles(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = {
                "blocked": [[0,2], [1,2], [2,2], [3,2]],
                "size": 5,
                "algorithm": "bfs"
            })

        self.assertEqual(response.status_code, 200)

        data = response.get_json()

        self.assertEqual(len(data["path"]), 9)
        self.assertEqual(len(data["explored"]), 14)

    def test_non_object_json(self):
        with app.test_client() as client:
            response = client.post("/api/bfs", json = [1,2,3])

        self.assertEqual(response.status_code, 400)

        data = response.get_json()
        self.assertIn("error", data)

if __name__ == "__main__":
    unittest.main()