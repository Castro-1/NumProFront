import { useState } from "react";
import Function from "../../components/Function";
import axios from "axios";
import Button from "../../components/Button";
import Input from "../../components/inputs/Input";
import Select from "../../components/inputs/Select";
import Results from "./features/Results";
import url from "../../assets/url";
import checkData from "../../components/checkData";
import { Title } from "../../components/Title";

export default function Newton() {
  const [inputs, setInputs] = useState({
    fun: "",
    dfun: "",
    x0: "",
    tol: "",
    niter: "",
    error: "0",
  });
  const [result, setResult] = useState(null);
  const [graph1, setGraph1] = useState(false);
  const [graph2, setGraph2] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  const handleInputs = (ev) => {
    let value = ev.target.value;
    if (ev.target.name === "fun") {
      setGraph1(false);
    } else if (ev.target.name === "dfun") {
      setGraph2(false);
    }
    setInputs((prev) => {
      return { ...prev, [ev.target.name]: value };
    });
  };

  const handleSubmit = async () => {
    let data = {
      fun: inputs.fun,
      x0: parseFloat(inputs.x0),
      tol: parseFloat(inputs.tol),
      niter: parseInt(inputs.niter),
      error: parseInt(inputs.error),
    };

    const validateData = checkData(data);
    if (validateData.is) {
      const response = await axios.post(`${url}/part1/newton/`, data);
      console.log(response.data);
      if (response.data.error) {
        setError(response.data.error);
        setResult(null);
        setGraph1(false);
        setGraph2(false);
      } else {
        setResult(response.data);
        setGraph1(true);
        setGraph2(true);
        setError(null);
        setSuggestions(null);
      }
    } else {
      setError(validateData.message);
      setResult(null);
      setGraph1(false);
      setGraph2(false);
      if (validateData.suggestions) {
        setSuggestions(validateData.suggestions);
      }
    }
  };

  return (
    <div>
      <Title>Newton-Raphson</Title>
      <div className="text-left">
        <div>
          <p>Función</p>
          <Input
            placeholder="x^3 - 2*x - 5"
            value={inputs.fun}
            onChange={handleInputs}
            name="fun"
          />
        </div>
        <div>
          <p>Derivada Función</p>
          <Input
            placeholder="3*x^2 - 2"
            value={inputs.dfun}
            onChange={handleInputs}
            name="dfun"
          />
        </div>
        <div>
          <p>x0</p>
          <Input
            name="x0"
            placeholder="2"
            onChange={handleInputs}
            value={inputs.x0}
          />
        </div>
        <div>
          <p>Tolerancia</p>
          <Input
            name="tol"
            placeholder="0.001"
            onChange={handleInputs}
            value={inputs.tol}
          />
        </div>
        <div>
          <p>Número iteraciones</p>
          <Input
            name="niter"
            placeholder="100"
            onChange={handleInputs}
            value={inputs.niter}
          />
        </div>
        <div>
          <p>Error</p>
          <Select name="error" onChange={handleInputs} value={inputs.error}>
            <option value={0}>Absoluto</option>
            <option value={1}>Relativo</option>
          </Select>
        </div>
        <div className="text-center">
          <Button onClick={handleSubmit}>Solucionar</Button>
        </div>
      </div>
      {error && <p>{error}</p>}
      {suggestions && (
        <ul>
          {suggestions.map((s) => (
            <li>{s}</li>
          ))}
        </ul>
      )}
      {graph1 && <Function method={"Newton f(x)"} expression={inputs.fun} />}
      {graph2 && <Function method={"Newton f'(x)"} expression={inputs.dfun} />}
      {result !== null && <Results {...result} />}
    </div>
  );
}
