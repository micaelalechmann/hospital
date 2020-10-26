import { Button, Form, Table } from "react-bootstrap";
import { Fragment, useState } from "react";

import '../../App.css';

function Reservations({ doctors, rooms, reservations, handleSubmit }) {
  const [doctor, setDoctor] = useState(doctors[0].name || "");
  const [room, setRoom] = useState(rooms[0].name || "");

  return (
    <Fragment>
      <Form className="form">
      <Form.Group controlId="formDoctor">
          <Form.Label>Sala</Form.Label>
          <Form.Control
            as="select"
            value={room}
            onChange={({ target }) => setRoom(target.value)}
            placeholder="Sala"
          >
            {rooms.map(({name}) => (
              <option>{name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formDoctor">
          <Form.Label>Médico</Form.Label>
          <Form.Control
            as="select"
            value={doctor}
            onChange={({ target }) => setDoctor(target.value)}
            placeholder="Médico"
          >
            {doctors.map(({name}) => (
              <option>{name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button
          variant="info"
          onClick={() => handleSubmit({ room, doctor })}
        >
          Adicionar
        </Button>
      </Form>

      <Table className="table" striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Sala</th>
            <th>Médico</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(({ room, doctor }, i) => {
            return (
              <tr>
                <td>{i + 1}</td>
                <td>{room}</td>
                <td>{doctor}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default Reservations;
