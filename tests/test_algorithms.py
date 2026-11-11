import unittest
from backend.algorithms.bfs import bfs
from backend.algorithms.dijkstra import dijkstra
from backend.algorithms.astar import astar

class TestBFS(unittest.TestCase):

    def test_empty_grid(self):
        result = bfs((0,0), (4,4), set(), 5, 5)

        self.assertEqual(len(result["path"]), 9)
        self.assertEqual(len(result["explored"]), 25)

    def test_no_path(self):
        blocked = {(0,1),(1,0)}

        result = bfs((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])
        self.assertEqual(len(result["explored"]), 1)

    def test_single_wall(self):
        blocked = {(0,2), (1,2), (2,2), (3,2)}

        result = bfs((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(len(result["path"]), 9)
        self.assertEqual(len(result["explored"]), 14)

    def test_blocked_start(self):
        blocked = {(0,0)}

        result = bfs((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])

    def test_blocked_destination(self):
        blocked = {(4,4)}

        result = bfs((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])

    def test_same_start_end(self):
        result = bfs((0,0), (0,0), set(), 5, 5)

        self.assertEqual(result["path"], [(0,0)])
        self.assertEqual(len(result["explored"]), 1)

class TestDijkstra(unittest.TestCase):

    def test_empty_grid(self):
        result = dijkstra((0,0), (4,4), set(), 5, 5)

        self.assertEqual(len(result["path"]), 9)
        self.assertEqual(len(result["explored"]), 25)

    def test_no_path(self):
        blocked = {(0,1), (1,0)}

        result = dijkstra((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])
        self.assertEqual(len(result["explored"]), 1)

    def test_single_wall(self):
        blocked = {(0,2), (1,2), (2,2), (3,2)}

        result = dijkstra((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(len(result["path"]), 9)
        self.assertEqual(len(result["explored"]), 14)

    def test_blocked_start(self):
        blocked = {(0,0)}

        result = dijkstra((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])

    def test_blocked_destination(self):
        blocked = {(4,4)}

        result = dijkstra((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])

    def test_same_start_end(self):
        result = dijkstra((0,0), (0,0), set(), 5, 5)

        self.assertEqual(result["path"],[(0,0)])
        self.assertEqual(len(result["explored"]), 1)

class TestAstar(unittest.TestCase):

    def test_empty_grid(self):
        result = astar((0,0), (4,4), set(), 5, 5)

        self.assertEqual(len(result["path"]), 9)
        self.assertEqual(len(result["explored"]), 9)

    def test_no_path(self):
        blocked = {(0,1), (1,0)}

        result = astar((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])
        self.assertEqual(len(result["explored"]), 1)

    def test_single_wall(self):
        blocked = {(0,2), (1,2), (2,2), (3,2)}

        result = astar((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(len(result["path"]), 9)
        self.assertEqual(len(result["explored"]), 9)

    def test_blocked_start(self):
        blocked = {(0,0)}

        result = astar((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])

    def test_blocked_destination(self):
        blocked = {(4,4)}

        result = astar((0,0), (4,4), blocked, 5, 5)

        self.assertEqual(result["path"], [])

    def test_same_start_end(self):
        result = astar((0,0), (0,0), set(), 5, 5)

        self.assertEqual(result["path"], [(0,0)])
        self.assertEqual(len(result["explored"]), 1)

if __name__ == "__main__":
    unittest.main()

