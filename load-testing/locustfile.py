import datetime
from locust import HttpUser, task, between


class AircraftMechanicUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def view_schedules(self):
        # Читання даних (не створює конфліктів)
        self.client.get("/api/maintenance/schedules?status=pending")

    @task(1)
    def send_telemetry(self):
        # Генеруємо поточний час у форматі ISO 8601 для КОЖНОГО запиту
        current_time = datetime.datetime.now(datetime.timezone.utc).isoformat()

        payload = {
            "time": current_time,
            "aircraft_id": 1,
            "parameter_name": "engine_temp",
            "value": 90.5,
        }

        # Відправляємо унікальні дані
        self.client.post("/api/telemetry", json=payload)
