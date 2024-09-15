const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

// 1) MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((t) => t.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "Failed",
      message: "No tour found with that ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (id >= tours.length) {
    return res.status(404).json({
      status: "Failed",
      message: "No tour found with that ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated tour here...",
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id >= tours.length) {
    return res.status(404).json({
      status: "Failed",
      message: "No tour found with that ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

// READ (GET ALL TOURS)
app.get("/api/v1/tours", getAllTours);

// READ (GET ONE TOUR)
app.get("/api/v1/tours/:id", getTour);

// CREATE (CREATE TOUR)
app.post("/api/v1/tours", createTour);

// UPDATE (UPDATE TOUR)
app.patch("/api/v1/tours/:id", updateTour);

// DELETE (DELETE TOUR)
app.delete("/api/v1/tours/:id", deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
