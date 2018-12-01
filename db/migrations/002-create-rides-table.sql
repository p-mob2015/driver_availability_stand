-- Up
CREATE TABLE IF NOT EXISTS Rides (
  id              BIGINT        PRIMARY KEY,
  timeRequested   DATETIME      NOT NULL,
  timeAccepted    DATETIME,
  timeArriving    DATETIME,
  timeInProgress  DATETIME,
  timeCompleted   DATETIME,
  timeCanceled    DATETIME,
  status          VARCHAR(50)   NOT NULL,
  driverId        BIGINT,
  CONSTRAINT Ride_fk_driverId FOREIGN KEY (driverId) REFERENCES Drivers (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Down
DROP TABLE Ride;
