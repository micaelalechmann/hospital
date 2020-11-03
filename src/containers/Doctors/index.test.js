import { fireEvent, render } from "@testing-library/react";
import { store } from "react-notifications-component";
import Doctors from "./";
import fixtures from "../../fixtures/fixtures.json";

const setup = (config) => {
  return {
    ...render(
      <Doctors
        doctors={fixtures.doctors}
        handleSubmit={jest.fn()}
        allocations={[]}
        prices={[]}
        reservations={[]}
        {...config}
      />
    ),
  };
};

it("should show error if all fields are not filled", () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-doctor"));

  fireEvent.click(getByTestId("confirm"));

  fireEvent.click(getByTestId("new-doctor"));

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


it("should not allow two doctors with the same CRM", () => {
  const { getByTestId } = setup();
  store.addNotification = jest.fn();

  fireEvent.click(getByTestId("new-doctor"));

  fireEvent.change(getByTestId("name"), { target: { value: "Carlos" } });
  fireEvent.change(getByTestId("crm"), { target: { value: "12345" } });

  fireEvent.click(getByTestId("confirm"));

  fireEvent.click(getByTestId("new-doctor"));

  expect(store.addNotification).toHaveBeenCalledWith({
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    container: "top-right",
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    insert: "top",
    message: "Já existe um médico com o CRM 12345",
    type: "danger",
  });
});
