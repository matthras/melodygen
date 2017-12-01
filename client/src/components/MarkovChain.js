import React from 'react';

function MarkovChainRow(props) {
  const columns = props.matrixRow.map( (cell) =>
    <td>{cell}</td>
  );
  return (
    <tr>{columns}</tr>
  );
}

export function MarkovChain(props) {
  const matrixRows = props.matrix.map( (row) =>
    <MarkovChainRow matrixRow={row} />
  )
  return (
    <table>
      <tbody>
      {matrixRows}
      </tbody>
    </table>
  )  
}