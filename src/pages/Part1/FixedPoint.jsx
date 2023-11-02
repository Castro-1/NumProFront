import { useState } from "react";
import Function from "./features/Function";
import axios from "axios";
import Button from "../../components/Button";

export default function FixedPoint() {
  const [inputs, setInputs] = useState({
    fun: "",
    dfun: "",
    a: 0,
    b: 0,
    tol: 0.0,
    niter: 0,
    error: 0,
  });
  const [result, setResult] = useState(null);
  const [graph1, setGraph1] = useState(false);
  const [graph2, setGraph2] = useState(false);

  const handleInputs = (ev) => {
    let value = ev.target.value;
    if (ev.target.name === "fun") {
      setGraph1(false);
    } else if (ev.target.name === "dfun"){
      setGraph2(false)
    }
    setInputs((prev) => {
      return { ...prev, [ev.target.name]: value };
    });
  };

  const handleSubmit = async () => {
    let data = {
      fun: inputs["fun"],
      dfun: inputs["dfun"],
      a: parseFloat(inputs["a"]),
      b: parseFloat(inputs["b"]),
      tol: parseFloat(inputs["tol"]),
      niter: parseInt(inputs["niter"]),
      error: parseInt(inputs["error"]),
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/part1/biseccion/",
      data
    );
    setResult(response.data);
    setGraph1(true);
    setGraph2(true)
  };

  const ResultsTable = ({ found, a, b, x, f, df, e }) => {
    const rows = a.map((value, i) => (
      <tr key={i} className="[&>*]:border-[0.1px]">
        <td>{i}</td>
        <td>{a[i]}</td>
        <td>{b[i]}</td>
        <td>{x[i]}</td>
        <td>{f[i]}</td>
        <td>{df[i]}</td>
        <td>{e[i]}</td>
      </tr>
    ));

    return (
      <table className="border-[0.1px] border-white [&>*]:border-[0.1px]">
        <thead className="">
          <tr>
            <th className="m-5">Iteración</th>
            <th>a</th>
            <th>b</th>
            <th>x</th>
            <th>f(x)</th>
            <th>g(x)</th>
            <th>error</th>
          </tr>
        </thead>
        <tbody className="[&>*]:border-[0.1px]">{rows}</tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Punto Fijo</h2>
      <div>
        <input
          placeholder="f(x)"
          value={inputs["fun"]}
          onChange={handleInputs}
          name="fun"
        />
        <input
          placeholder="g(x)"
          value={inputs["dfun"]}
          onChange={handleInputs}
          name="dfun"
        />
        <Button onClick={() => {setGraph1(true); setGraph2(true)}}>Graficar</Button>
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
        <select name="error" onChange={handleInputs} value={inputs["error"]}>
          <option value={0}>Error absoluto</option>
          <option value={1}>Error relativo</option>
        </select>
        <Button onClick={handleSubmit}>Solucionar</Button>
      </div>
      {graph1 && <Function method={"Punto Fijo f(x)"} expression={inputs["fun"]} />}
      {graph2 && <Function method={"Punto Fijo g(x)"} expression={inputs["dfun"]} />}
      {result !== null && <ResultsTable {...result} />}
    </div>
  );
}
