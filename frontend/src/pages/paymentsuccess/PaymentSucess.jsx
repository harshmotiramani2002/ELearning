import React from 'react'
import "./payments.css"
import { Link, useParams } from 'react-router-dom'
const PaymentSucess = ({user}) => {
    const params = useParams()
  return (
    <div className='payment-success'>
        {
            user && <div className="sucess-message">
                <h2>Payment Successful</h2>
                <p>Your course subscription has been activated</p>
                <p className='p1'>Refrenece no - {params.id}</p>
                <Link to={`/${user._id}/dashboard`} className='common-btn' >Go To Dashboard</Link>
            </div>
        }
    </div>
  )
}

export default PaymentSucess