import "bootstrap/dist/css/bootstrap.min.css";
import { isAfter, isBefore } from "date-fns";
import { Fragment, useCallback, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ReactNotification, { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "./App.css";
import Allocations from "./containers/Allocations";
import Doctors from "./containers/Doctors";
import Manager from "./containers/Manager";
import Reservations from "./containers/Reservations";
import Rooms from "./containers/Rooms";
import fixtures from "./fixtures/fixtures.json";

export const addErrorNotification = (message) => {
  store.addNotification({
    message,
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

function App() {
  const [doctors, setDoctors] = useState(fixtures.doctors);
  const [rooms, setRooms] = useState(fixtures.rooms);
  const [reservations, setReservations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [prices, setPrices] = useState([
    {
      type: "Pequena",
      price: 400,
    },
    {
      type: "Grande",
      price: 650,
    },
    {
      type: "Alto risco",
      price: 1200,
    },
  ]);

  const addDoctor = (doctor) => {
    setDoctors((doctors) => [...doctors, doctor]);
  };

  const addRoom = (room) => {
    setRooms((rooms) => [...rooms, room]);
  };

  const addReservation = (reservation) => {
    setReservations((reservations) => [...reservations, reservation]);
  };

  const changePrices = (prices) => {
    setPrices(prices);
  };

  const allocations = useCallback(
    () =>
      reservations.filter(({ interval }) =>
        isBefore(interval.start, new Date())
      ),
    [reservations]
  );

  const filter = ({ start, end }) => {
    const filtered = allocations().filter(({ interval }) => {
      return isAfter(interval.start, start) && isBefore(interval.end, end);
    });

    setFilteredAllocations(filtered);
  };

  const cancelReservation = (index) => {
    const filteredReservations = reservations.filter((_, i) => i !== index);
    setReservations(filteredReservations);
  };

  return (
    <Fragment>
      <ReactNotification />

      <Tabs defaultActiveKey="doctors">
        <Tab eventKey="doctors" title="Médicos">
          <Doctors
            doctors={doctors}
            handleSubmit={addDoctor}
            allocations={allocations()}
            reservations={reservations}
            prices={prices}
          />
        </Tab>
        <Tab eventKey="rooms" title="Salas">
          <Rooms
            rooms={rooms}
            handleSubmit={addRoom}
            allocations={allocations()}
            reservations={reservations}
            prices={prices}
          />
        </Tab>
        <Tab eventKey="reservations" title="Reservas">
          <Reservations
            reservations={reservations}
            doctors={doctors}
            rooms={rooms}
            prices={prices}
            handleSubmit={addReservation}
            handleCancel={cancelReservation}
          />
        </Tab>
        <Tab eventKey="allocations" title="Alocações">
          <Allocations
            allocations={filteredAllocations}
            handleSubmit={filter}
          />
        </Tab>
        <Tab eventKey="manager" title="Administração">
          <Manager prices={prices} handleChange={changePrices} />
        </Tab>
      </Tabs>
    </Fragment>
  );
}

export default App;
