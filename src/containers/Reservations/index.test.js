import { fireEvent, render } from "@testing-library/react";
import { store } from "react-notifications-component";
import fixtures from "../../fixtures/fixtures.json";
import Reservations from "./";
import { INITIAL_PRICES } from "../../App";

const reservation = {
    doctor: fixtures.doctors[0],
    room: fixtures.rooms[3],
    interval: {
        start: new Date('2020-11-20 13:00'),
        end:  new Date('2020-11-20 15:00')
    },
    date: '20/11/2020'
}

const setup = (config) => {
  return {
    ...render(
      <Reservations
        doctors={fixtures.doctors}
        rooms={fixtures.rooms}
        reservations={[reservation]}
        prices={INITIAL_PRICES}
        handleSubmit={jest.fn()}
        handleCancel={jest.fn()}
        {...config}
      />
    ),
  };
};

it("should show error if all fields are not filled", () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.click(getByTestId("confirm"));

  expect(store.addNotification).toHaveBeenCalledWith({
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    container: "top-right",
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    insert: "top",
    message: "Preencha todos os campos para continuar",
    type: "danger",
  });
});

it("should show only surgery rooms to surgeons", () => {
  const { getByTestId, getAllByRole } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.click(getByTestId("room"));

  const options = getAllByRole("option");

  expect(options[0]).toHaveTextContent("Sala 4");
  expect(options[1]).toHaveTextContent("Sala 5");
  expect(options[2]).toHaveTextContent("Sala 6");
  expect(options[3]).toHaveTextContent("Sala 7");
  expect(options[4]).toHaveTextContent("Sala 8");
});

it("should show only dermatology rooms to dermatologists", () => {
  const { getByTestId, getAllByRole } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.change(getByTestId("doctor"), {
    target: { value: fixtures.doctors[2] },
  });

  fireEvent.click(getByTestId("room"));

  const options = getAllByRole("option");

  expect(options[0]).toHaveTextContent("Sala 1");
  expect(options[1]).toHaveTextContent("Sala 2");
  expect(options[2]).toHaveTextContent("Sala 3");
});

it('should not allow to book a room on a time that is already booked', () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.change(getByTestId('date'), {
    target: {value: '20/11/2020'}
  });

  fireEvent.change(getByTestId('enter-time'), {
    target: {value: '12:00'}
  });

  fireEvent.change(getByTestId('exit-time'), {
    target: {value: '14:00'}
  });

  fireEvent.click(getByTestId("confirm"));

  expect(store.addNotification).toHaveBeenCalledWith({
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    container: "top-right",
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    insert: "top",
    message: "A sala Sala 4 já está reservada neste horário",
    type: "danger",
  });
});

it('should not allow to book a small room for less than 2 hours', () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.change(getByTestId("doctor"), {
    target: { value: fixtures.doctors[2].name },
  });

  fireEvent.change(getByTestId("room"), {
    target: { value: fixtures.rooms[0].name },
  });

  fireEvent.change(getByTestId('date'), {
    target: {value: '21/11/2020'}
  });

  fireEvent.change(getByTestId('enter-time'), {
    target: {value: '12:00'}
  });

  fireEvent.change(getByTestId('exit-time'), {
    target: {value: '13:00'}
  });

  fireEvent.click(getByTestId("confirm"));

  expect(store.addNotification).toHaveBeenCalledWith({
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    container: "top-right",
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    insert: "top",
    message: "O mínimo para reserva é de 2 horas",
    type: "danger",
  });
});

it('should not allow to book a high risk room for less than 3 hours', () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.change(getByTestId("doctor"), {
    target: { value: fixtures.doctors[0].name },
  });

  fireEvent.change(getByTestId("room"), {
    target: { value: fixtures.rooms[6].name },
  });

  fireEvent.change(getByTestId('date'), {
    target: {value: '21/11/2020'}
  });

  fireEvent.change(getByTestId('enter-time'), {
    target: {value: '12:00'}
  });

  fireEvent.change(getByTestId('exit-time'), {
    target: {value: '14:00'}
  });

  fireEvent.click(getByTestId("confirm"));

  expect(store.addNotification).toHaveBeenCalledWith({
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    container: "top-right",
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    insert: "top",
    message: "O mínimo para reserva de salas de alto risco é de 3 horas",
    type: "danger",
  });
});

it('should not allow to book a room before 6:00', () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.change(getByTestId('date'), {
    target: {value: '21/11/2020'}
  });

  fireEvent.change(getByTestId('enter-time'), {
    target: {value: '05:00'}
  });

  fireEvent.change(getByTestId('exit-time'), {
    target: {value: '07:00'}
  });

  fireEvent.click(getByTestId("confirm"));

  expect(store.addNotification).toHaveBeenCalledWith({
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    container: "top-right",
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    insert: "top",
    message: "Reservas devem ser feitas das 06:00 às 22:00",
    type: "danger",
  });
});

it('should not allow to book a room after 22:00', () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-reservation"));

  fireEvent.change(getByTestId('date'), {
    target: {value: '21/11/2020'}
  });

  fireEvent.change(getByTestId('enter-time'), {
    target: {value: '22:30'}
  });

  fireEvent.change(getByTestId('exit-time'), {
    target: {value: '23:59'}
  });

  fireEvent.click(getByTestId("confirm"));

  expect(store.addNotification).toHaveBeenCalledWith({
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    container: "top-right",
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    insert: "top",
    message: "Reservas devem ser feitas das 06:00 às 22:00",
    type: "danger",
  });
});

it('should show reservation total budget according to room price', () => {
  const { getByTestId } = setup();

  expect(getByTestId('bugdet-0')).toHaveTextContent('1300');
});

it('should call handle cancel when cancelling a reservation', () => {
  const handleCancel = jest.fn();
  const { getByTestId } = setup({handleCancel});
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId('cancel-0'));

  expect(handleCancel).toHaveBeenLastCalledWith(0);
});