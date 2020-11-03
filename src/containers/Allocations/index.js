import { format, isAfter, isBefore, isValid } from "date-fns";
import { Fragment, useState } from "react";
import { Button, Col, Form, Table } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { addErrorNotification } from "../../App";
import "../../App.css";

function Allocations({ allocations, handleSubmit }) {
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const validate = () => {
    if (!start || !end) {
      addErrorNotification("Preencha todos os campos para continuar");
      return;
    }
    try {
      const [startDay, startMonth, startYear] = start.split("/");
      const [endDay, endMonth, endYear] = end.split("/");

      const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
      const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

      if (!isValid(startDate) || !isValid(endDate)) {
        addErrorNotification("Insira uma data válida.");
        return;
      }

      if (isAfter(endDate, new Date())) {
        addErrorNotification("Insira uma data passada.");
        return;
      }

      if (isBefore(endDate, startDate)) {
        addErrorNotification(
          "O horário de saída é anterior ao horário de entrada."
        );
        return;
      }

      handleSubmit({start: startDate, end: endDate})
    } catch (e) {
      console.log(e);
      addErrorNotification("Preencha todos os campos para continuar");
    }
  };

  return (
    <Fragment>
      <Form className="form">
        <Form.Group controlId="formDoctor">
          <Form.Row>
            <Col>
              <Form.Label>Período inicial</Form.Label>
              <ReactInputMask
                mask="99/99/9999"
                data-testid="start"
                className="form-control"
                value={start}
                onChange={({ target }) => setStart(target.value)}
                placeholder="dd/MM/yyyy"
              />
            </Col>

            <Col>
              <Form.Label>Período final</Form.Label>
              <ReactInputMask
                mask="99/99/9999"
                data-testid="end"
                className="form-control"
                value={end}
                onChange={({ target }) => setEnd(target.value)}
                placeholder="dd/MM/yyyy"
              />
            </Col>
          </Form.Row>
        </Form.Group>

        <Button
          variant="primary"
          data-testid="filter"
          onClick={validate}
        >
          Filtrar
        </Button>
      </Form>

      {allocations.length > 0 && (
        <Table className="table" striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Sala</th>
              <th>Médico</th>
              <th>Data</th>
              <th>Hora de entrada</th>
              <th>Hora de saída</th>
              <th>Custos</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map(
              ({ room, doctor, date, interval, totalPrice }, i) => {
                return (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{room.name}</td>
                    <td>{doctor.name}</td>
                    <td>{date}</td>
                    <td>{format(interval.start, "HH:mm")}</td>
                    <td>{format(interval.end, "HH:mm")}</td>
                    <td>{totalPrice}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
      )}
    </Fragment>
  );
}

export default Allocations;
