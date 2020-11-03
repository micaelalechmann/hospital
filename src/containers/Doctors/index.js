import { differenceInMinutes, isAfter } from "date-fns";
import { Fragment, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { addErrorNotification } from "../../App";
import "../../App.css";
import { SPECIALTIES } from "../../constants";

function Doctors({ doctors, handleSubmit, allocations, reservations, prices }) {
  const [name, setName] = useState("");
  const [crm, setCrm] = useState();
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [show, setShow] = useState(false);

  const hasFilledAllFields = !!name && !!crm && !!specialty;

  const getTotalCost = ({ crm }) =>
    allocations.reduce((acc, { totalPrice, doctor }) => {
      if (doctor.crm === crm) return acc + totalPrice;

      return acc;
    }, 0);

  const getTotalBudget = ({ crm }) =>
    reservations.reduce((acc, { doctor, interval, room }) => {
      if (doctor.crm === crm && isAfter(interval.start, new Date())) {
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

    const isUniqueCRM = !doctors.some((doctor) => doctor.crm === crm);

    if (!isUniqueCRM) {
      addErrorNotification(`Já existe um médico com o CRM ${crm}`);
      return;
    }

    setShow(false);
    handleSubmit({ name, crm, specialty });
  };

  return (
    <Fragment>
      <Button
        variant="primary"
        data-testid="new-doctor"
        onClick={() => setShow(true)}
      >
        Adicionar médico
      </Button>

      <Modal size="lg" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo médico</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form">
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={name}
                data-testid="name"
                onChange={({ target }) => setName(target.value)}
                type="text"
                placeholder="Nome"
              />

              <Form.Label>CRM</Form.Label>
              <Form.Control
                value={crm}
                data-testid="crm"
                onChange={({ target }) => setCrm(target.value)}
                type="number"
                placeholder="CRM"
              />

              <Form.Label>Especialidade</Form.Label>
              <Form.Control
                as="select"
                value={specialty}
                data-testid="specialty"
                onChange={({ target }) => setSpecialty(target.value)}
                placeholder="Especialidade"
              >
                {SPECIALTIES.map((type) => (
                  <option>{type}</option>
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

      <Table className="table" striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CRM</th>
            <th>Especialidade</th>
            <th>Custo total</th>
            <th>Orçamento</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(({ name, crm, specialty }, i) => {
            return (
              <tr>
                <td>{i + 1}</td>
                <td>{name}</td>
                <td>{crm}</td>
                <td>{specialty}</td>
                <td>{getTotalCost({ crm })}</td>
                <td>{getTotalBudget({ crm })}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default Doctors;
