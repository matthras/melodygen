import React from 'react';

function MarkovChainRow(props) {
  // Key indexes of each cell are set up so that when any value of the Markov Chain is changed, the key references the correct entry and no further number wrangling is needed. 
  const columns = props.matrixRow.map( (cell, index) =>
    (index===0) 
      ? <td key={props.rowIndex+","+(index-1)}>{cell}</td> 
      : <td>
          <input className="markovchainInput" type="number" key={props.rowIndex+","+(index-1)} value={cell}></input>
        </td>
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