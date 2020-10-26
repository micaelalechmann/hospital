import { Button, Form, Table } from "react-bootstrap";
import { Fragment, useState } from "react";

import '../../App.css';

function Doctors({ doctors, handleSubmit }) {
  const [name, setName] = useState("");
  const [crm, setCrm] = useState();
  const [specialty, setSpecialty] = useState("");

  return (
    <Fragment>
      <Form className="form">
        <Form.Group controlId="formDoctor">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={name}
            onChange={({ target }) => setName(target.value)}
            type="text"
            placeholder="Nome"
          />
        </Form.Group>

        <Form.Group controlId="formDoctor">
          <Form.Label>CRM</Form.Label>
          <Form.Control
            value={crm}
            onChange={({ target }) => setCrm(target.value)}
            type="number"
            placeholder="CRM"
          />
        </Form.Group>

        <Form.Group controlId="formDoctor">
          <Form.Label>Especialidade</Form.Label>
          <Form.Control
            value={specialty}
            onChange={({ target }) => setSpecialty(target.value)}
            type="text"
            placeholder="Especialidade"
          />
        </Form.Group>

        <Button
          variant="info"
          onClick={() => handleSubmit({ name, crm, specialty })}
        >
          Adicionar
        </Button>
      </Form>

      <Table className="table" striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CRM</th>
            <th>Especialidade</th>
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
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default Doctors;
