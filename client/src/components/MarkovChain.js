import React from 'react';

function MarkovChainRow(props) {
  const columns = props.matrixRow.map( (cell, index) =>
    <td key={props.rowIndex+","+(index-1)}>{cell}</td>
  );
  return (
    <tr>{columns}</tr>
  );
}

export function MarkovChain(props) {
  const topLabels = props.pitchClasses.map( (label, index) => 
    <td key={"label"+index}>{label}</td> 
  );
  // Concatenates the pitch class labels to the left of the Markov chain so that they're included in the table.
  const includeLeftLabels = props.matrix.map( (row,index) => [props.pitchClasses[index]].concat(row)
  )
  const matrixRows = includeLeftLabels.map( (row,index) =>
    <MarkovChainRow matrixRow={row} rowIndex={index} />
  );
  return (
    <table>
      <tbody>
      <tr><td></td>{topLabels}</tr>
      {matrixRows}
      </tbody>
    </table>
  )  
}