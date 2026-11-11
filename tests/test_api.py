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

if __name__ == "__main__":
    unittest.main()