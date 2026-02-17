from datetime import datetime, timedelta
from collections import defaultdict
import threading


class RateLimiter:
    """
    Simple in-memory rate limiter.
    Tracks usage per user_id with a daily limit.
    Resets at midnight UTC.
    """

    def __init__(self, daily_limit: int = 20):
        self.daily_limit = daily_limit
        self.usage = defaultdict(lambda: {"count": 0, "reset_date": None})
        self.lock = threading.Lock()

    def _get_today(self):
        return datetime.utcnow().date()

    def check_and_increment(self, user_id: int) -> dict:
        """
        Returns {"allowed": True/False, "remaining": int, "resets_at": str}
        """
        with self.lock:
            today = self._get_today()
            user_data = self.usage[user_id]

            # Reset if it's a new day
            if user_data["reset_date"] != today:
                user_data["count"] = 0
                user_data["reset_date"] = today

            if user_data["count"] >= self.daily_limit:
                tomorrow = datetime.combine(today + timedelta(days=1), datetime.min.time())
                return {
                    "allowed": False,
                    "remaining": 0,
                    "resets_at": tomorrow.isoformat() + "Z",
                }

            user_data["count"] += 1
            remaining = self.daily_limit - user_data["count"]

            return {
                "allowed": True,
                "remaining": remaining,
                "resets_at": None,
            }

    def get_remaining(self, user_id: int) -> int:
        with self.lock:
            today = self._get_today()
            user_data = self.usage[user_id]
            if user_data["reset_date"] != today:
                return self.daily_limit
            return max(0, self.daily_limit - user_data["count"])


# Single instance used across the app
ai_rate_limiter = RateLimiter(daily_limit=20)