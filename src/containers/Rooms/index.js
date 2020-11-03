import { differenceInMinutes, isAfter } from "date-fns";
import { Fragment, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { addErrorNotification } from "../../App";
import "../../App.css";
import { ROOM_TYPES } from "../../constants";

function Rooms({ rooms, handleSubmit, allocations, reservations, prices }) {
  const [name, setName] = useState("");
  const [type, setType] = useState(ROOM_TYPES[0]);
  const [show, setShow] = useState(false);

  const hasFilledAllFields = !!name && !!type;

  const getTotalCost = ({ name }) =>
    allocations.reduce((acc, { totalPrice, room }) => {
      if (room.name === name) return acc + totalPrice;

      return acc;
    }, 0);

  const getTotalBudget = ({ name }) =>
    reservations.reduce((acc, { room, interval }) => {
      if (room.name === name && isAfter(interval.start, new Date())) {
        let discount = 0;

        if (room.type === "Alto risco" && interval.start.getHours() < 10) {
          discount = 0.1;
        }

        const { price } = prices.find(({ type }) => type === room?.type);
        const pricePerMinute = price / 60;
        const totalPrice =
          pricePerMinute *
          differenceInMinutes(interval.end, interval.start) *
          (1 - discount);
        return acc + totalPrice;
      }

      return acc;
    }, 0);

  const validate = () => {
    if (!hasFilledAllFields) {
      addErrorNotification("Preencha todos os campos para continuar");
      return;
    }

    setShow(false);
    handleSubmit({ name, type });
  };

  return (
    <Fragment>
      <Button
        variant="primary"
        data-testid="add-room"
        onClick={() => setShow(true)}
      >
        Adicionar sala
      </Button>

      <Modal size="lg" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form">
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                data-testid="room-name"
                value={name}
                onChange={({ target }) => setName(target.value)}
                type="text"
                placeholder="Nome"
              />

              <Form.Label>Tipo</Form.Label>
              <Form.Control
                data-testid="room-type"
                as="select"
                value={type}
                onChange={({ target }) => setType(target.value)}
                placeholder="Tipo"
              >
                {ROOM_TYPES.map((type) => (
                  <option data-testid={type.toLowerCase().replace(" ", "-")}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            data-testid="reject"
            onClick={() => setShow(false)}
          >
            Fechar
          </Button>
          <Button variant="primary" data-testid="confirm" onClick={validate}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>

      <Table className="table" data-testid="table" striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Custo total</th>
            <th>Orçamento</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(({ name, type }, i) => {
            return (
              <tr>
                <td>{i + 1}</td>
                <td>{name}</td>
                <td>{type}</td>
                <td>{getTotalCost({ name })}</td>
                <td>{getTotalBudget({ name })}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default Rooms;
