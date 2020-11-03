import {
  areIntervalsOverlapping,
  differenceInHours,
  differenceInMinutes,
  format,
  getHours,
  getMinutes,
  isAfter,
  isBefore,
  isValid
} from "date-fns";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Table } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { addErrorNotification } from "../../App";
import "../../App.css";
import {
  DERMATOLOGY_ROOMS,
  SURGERY_ROOMS,
  SURGERY_SPECIALTIES
} from "../../constants";

function Reservations({
  doctors,
  rooms,
  reservations,
  prices,
  handleSubmit,
  handleCancel,
}) {
  const [doctor, setDoctor] = useState(doctors[0]);
  const [room, setRoom] = useState();
  const [enterTime, setEnterTime] = useState();
  const [exitTime, setExitTime] = useState();
  const [date, setDate] = useState();
  const [show, setShow] = useState(false);

  const availableRooms = useMemo(() => {
    if (SURGERY_SPECIALTIES.includes(doctor?.specialty)) {
      const surgeryRooms = rooms.filter(({ type }) =>
        SURGERY_ROOMS.includes(type)
      );
      setRoom(surgeryRooms[0]);
      return surgeryRooms;
    } else {
      const dermatologyRooms = rooms.filter(({ type }) =>
        DERMATOLOGY_ROOMS.includes(type)
      );
      setRoom(dermatologyRooms[0]);
      return dermatologyRooms;
    }
  }, [doctor?.specialty, rooms]);

  const hasFilledAllFields =
    !!doctor && !!room && !!enterTime && !!exitTime && !!date;

  const totalPrice = useCallback(
    ({ room, interval }) => {
      let discount = 0;
      if (isBefore(interval.start, new Date())) return;

      if (room.type === "Alto risco" && interval.start.getHours() < 10) {
        discount = 0.1;
      }

      const { price } = prices.find(({ type }) => type === room?.type);
      const pricePerMinute = price / 60;
      return (
        pricePerMinute *
        differenceInMinutes(interval.end, interval.start) *
        (1 - discount)
      );
    },
    [prices]
  );

  const validate = () => {
    try {
      if (!hasFilledAllFields) {
        addErrorNotification("Preencha todos os campos para continuar");
        return;
      }

      const [day, month, year] = date.split("/");

      const enterDate = new Date(`${year}-${month}-${day} ${enterTime}`);
      const exitDate = new Date(`${year}-${month}-${day} ${exitTime}`);

      if (!isValid(enterDate) || !isValid(exitDate)) {
        addErrorNotification("Insira uma data válida.");
        return;
      }

      if (isBefore(enterDate, new Date())) {
        addErrorNotification("Insira uma data futura.");
        return;
      }

      if (isBefore(exitDate, enterDate)) {
        addErrorNotification(
          "O horário de saída é anterior ao horário de entrada."
        );
        return;
      }

      if (
        getHours(enterDate) < 6 ||
        (getHours(exitDate) > 22 && getMinutes(exitDate) > 0)
      ) {
        addErrorNotification("Reservas devem ser feitas das 06:00 às 22:00");
        return;
      }

      const differenceBetweenTimes = differenceInHours(exitDate, enterDate);

      if (room.type === "Alto risco" && differenceBetweenTimes < 3) {
        addErrorNotification("O mínimo para salas de alto risco é de 3 horas");
        return;
      } else if (room.type !== "Alto risco" && differenceBetweenTimes < 2) {
        addErrorNotification("O mínimo para reserva é de 2 horas");
        return;
      }

      const interval = { start: enterDate, end: exitDate };

      const isRoomBooked = reservations.some((r) => {
        return r.room === room && areIntervalsOverlapping(r.interval, interval);
      });

      if (isRoomBooked) {
        addErrorNotification(
          `A sala ${room.name} já está reservada neste horário`
        );
        return;
      }

      setShow(false);
      handleSubmit({
        doctor,
        room,
        date,
        interval,
        totalPrice: totalPrice({ room, interval }),
      });
    } catch (e) {
      addErrorNotification("Insira uma data válida.");
      console.log(e);
    }
  };

  return (
    <Fragment>
      <Button
        variant="primary"
        data-testid="add-reservation"
        onClick={() => setShow(true)}
      >
        Adicionar reserva
      </Button>

      <Modal size="lg" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nova reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form">
            <Form.Group>
              <Form.Label>Sala</Form.Label>
              <Form.Control
                as="select"
                value={room?.name}
                data-testid="room"
                onChange={({ target }) =>
                  setRoom(rooms.find(({ name }) => target.value === name))
                }
                placeholder="Sala"
              >
                {availableRooms.map(({ name }) => (
                  <option>{name}</option>
                ))}
              </Form.Control>
              <Form.Label>Médico</Form.Label>
              <Form.Control
                data-testid="doctor"
                as="select"
                value={doctor?.name}
                onChange={({ target }) =>
                  setDoctor(doctors.find(({ name }) => target.value === name))
                }
                placeholder="Médico"
              >
                {doctors.map(({ name }) => (
                  <option>{name}</option>
                ))}
              </Form.Control>

              <Form.Label>Data</Form.Label>
              <ReactInputMask
                data-testid="date"
                mask="99/99/9999"
                className="form-control"
                value={date}
                onChange={({ target }) => setDate(target.value)}
                placeholder="Data"
              />

              <Form.Row>
                <Col>
                  <Form.Label>Horário de entrada</Form.Label>
                  <ReactInputMask
                    data-testid="enter-time"
                    mask="99:99"
                    className="form-control"
                    value={enterTime}
                    onChange={({ target }) => setEnterTime(target.value)}
                    placeholder="Horário de entrada"
                  />
                </Col>

                <Col>
                  <Form.Label>Horário de saída</Form.Label>
                  <ReactInputMask
                    data-testid="exit-time"
                    mask="99:99"
                    className="form-control"
                    value={exitTime}
                    onChange={({ target }) => setExitTime(target.value)}
                    placeholder="Horário de saída"
                  />
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            data-tesid="reject"
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
            <th>Sala</th>
            <th>Médico</th>
            <th>Data</th>
            <th>Hora de entrada</th>
            <th>Hora de saída</th>
            <th>Orçamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservations
            .filter(({ interval }) => isAfter(interval.start, new Date()))
            .map(({ room, doctor, date, interval }, i) => {
              return (
                <tr>
                  <td>{i + 1}</td>
                  <td>{room.name}</td>
                  <td>{doctor.name}</td>
                  <td>{date}</td>
                  <td>{format(interval.start, "HH:mm")}</td>
                  <td>{format(interval.end, "HH:mm")}</td>
                  <td>{totalPrice({ room, interval })}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancel(i)}
                    >
                      Cancelar reserva
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default Reservations;
