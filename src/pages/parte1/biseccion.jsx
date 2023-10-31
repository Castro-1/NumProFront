import { useState } from "react";
import Function from "./features/Function";
import axios from "axios";

const Biseccion = () => {
  const [inputs, setInputs] = useState({
    fun: "",
    a: 0,
    b: 0,
    tol: 0.0,
    niter: 0,
  });
  const [result, setResult] = useState(null);
  const [graph, setGraph] = useState(false);

  // const handleFunction = (ev) => {
  //   let fun = ev.target.value.replace(/\^/g, "**");
  //   setInputs((prev) => ({
  //     ...prev,
  //     fun,
  //   }));
  //   setGraph(false);
  // };

  // console.log(fx);

  const handleInputs = (ev) => {
    let value = ev.target.value;
    if (ev.target.name === "fun") {
      setGraph(false);
    }
    setInputs((prev) => {
      return { ...prev, [ev.target.name]: value };
    });
  };

  const handleSubmit = async () => {
    let data = {
      fun: inputs["fun"],
      a: parseInt(inputs["a"]),
      b: parseInt(inputs["b"]),
      tol: parseFloat(inputs["tol"]),
      niter: parseInt(inputs["niter"]),
    };
    const response = await axios.post(
      "http://127.0.0.1:8000/part1/biseccion/",
      data
    );
    setResult(response.data);
    setGraph(true);
  };

  const ResultsTable = ({ found, a, b, x, f, e }) => {
    console.log(a);
    const rows = a.map((value, i) => (
      <tr key={i}>
        <td>{i}</td>
        <td>{a[i]}</td>
        <td>{b[i]}</td>
        <td>{x[i]}</td>
        <td>{f[i]}</td>
        <td>{e[i]}</td>
      </tr>
    ));

    console.log(rows);
    return (
      <table>
        <thead>
          <tr>
            <th>Iteración</th>
            <th>a</th>
            <th>b</th>
            <th>x</th>
            <th>f(x)</th>
            <th>error</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Bisección</h2>
      <div>
        <input
          placeholder="f(x)"
          value={inputs["fun"]}
          onChange={handleInputs}
          name="fun"
        />
        <input
          type="number"
          name="a"
          placeholder="a"
          onChange={handleInputs}
          value={inputs["a"]}
        />
        <input
          type="number"
          name="b"
          placeholder="b"
          onChange={handleInputs}
          value={inputs["b"]}
        />
        <input
          type="number"
          name="tol"
          placeholder="tolerancia"
          onChange={handleInputs}
          value={inputs["tol"]}
        />
        <input
          type="number"
          name="niter"
          placeholder="iteraciones"
          onChange={handleInputs}
          value={inputs["niter"]}
        />
        <select name="error">
          <option value="absoluto">Error absoluto</option>
          <option value="relativo">Error relativo</option>
        </select>
        <button onClick={handleSubmit}>Solucionar</button>
      </div>
      {graph && <Function method={"Bisección"} expression={inputs["fun"]} />}
      {result !== null && <ResultsTable {...result} />}
    </div>
  );
};

export default Biseccion;
