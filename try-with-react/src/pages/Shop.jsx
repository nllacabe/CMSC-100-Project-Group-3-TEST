import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Shop() {

  const [ items, setItems ] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/get-all-products')
      .then(response => response.json())
      .then(body => {
        setItems(body)
      })
  })

  return (
    <>
      <div>
        {items.map((item, i) =>
            <div>{item.productName}</div>
        )}
      </div>
    </>
  )
}