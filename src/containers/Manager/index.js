import { Fragment } from "react";
import { Form } from "react-bootstrap";
import "../../App.css";

function Manager({ prices, handleChange }) {
  const enhanceOnChange = ({ type, value }) => {
    const newPrices = prices.reduce((acc, price) => {
      if (type === price.type) return [...acc, { type, price: value }];

      return [...acc, price];
    }, []);

    handleChange(newPrices);
  };

  return (
    <Fragment>
      <Form className="form">
        <Form.Group>
          {prices.map(({ type, price }) => (
            <Fragment>
              <Form.Label>Preço da sala {type.toLowerCase()}</Form.Label>

              <Form.Control
                type="number"
                value={price}
                onChange={({ target }) =>
                  enhanceOnChange({ type, value: target.value })
                }
                placeholder="Preço"
              />
            </Fragment>
          ))}
        </Form.Group>
      </Form>
    </Fragment>
  );
}

export default Manager;
