import React, { useState } from 'react';

export default function Expenses({ onSave, categories, expenses, onAddNewCategory, setSelectedCategory, sortByPrice, searchTerm, deleteExpense }) {
  
  const [modal, setModal] = useState(false);
  const [modalForNew, setModalNew] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [image, setImage] = useState(null)
  const [summa, setSumma] = useState('')
  const [date, setDate] = useState('')
  const [comment, setComment] = useState('')

  const funcModal = () => {
    setModal(true)
  }

  const funcModNew = () => {
    setModalNew(true)
  }

  const addNewCategory= () => {
    const newCategoryObj = { id: Math.random(), name: newCategory, imgUrl: image }
    onAddNewCategory(newCategoryObj)
    setModalNew(false)
    setNewCategory('')
    setImage('')
  
  }


  const forImage = (event) => {
    const file = event.target.files[0]
    const read = new FileReader()

    read.onload = () => {
      setImage(read.result)
    }
    if (file) {
      read.readAsDataURL(file)
    }
  }

  const saveInMain = () => {
    
    const expensesData = { summa, date, comment }
    onSave(expensesData)

    setSumma('')
    setDate('')
    setComment('')
    setModal(false)
  }


  return (
    <div className='expenses'>
      <h1>Расходы</h1>
      <h3>Выберите категорию</h3>

      <div className='category-expenses-cont'>
        {categories.map(category => (
          <div key={category.id} className='category-expenses' onClick={funcModal}>
            <h3>{category.name}</h3>
            <img src={category.imgUrl} width='100px'></img>
          </div>
        ))}
        <div className='category-expenses' onClick={funcModNew}>
          <p style={{ margin: '10px auto' }}>Добавить</p>    
          <img src='https://i.pinimg.com/736x/52/d8/73/52d873dfed55456f5dd10b0c93de5f8d--scarlett-swiss.jpg' width='80px'></img>    
        </div>
      </div>

      {modal && (
        <div className='modalEx-cont'>
          <div className='modalExpenses'>
            <label>
              Сумма<br></br>
              <input type='number' placeholder='сумма...' value={summa} onChange={(e) => setSumma(e.target.value)}></input>
            </label>
            <label>
              Дата<br></br>
              <input type='date' value={date} onChange={(e) => setDate(e.target.value)}></input>
            </label>
            <label>
              Комментарий<br></br>
              <input type='text' placeholder='комментарий...' value={comment} onChange={(e) => setComment(e.target.value)}></input>
            </label>

            <button onClick={saveInMain} type='submit' className='modalButton'>Добавить</button>
            <button onClick={()=>setModal(false)} className='modalButton'>Назад</button>
          </div>
        </div>
      )}

      {modalForNew && (
        <div className='modalEx-cont'>
          <div className='expenses-newCategory'>
            <label>
              Введите название новой категории<br></br>
              <input type='text' placeholder='категория' value={newCategory} onChange={(event) => setNewCategory(event.target.value)}></input>
            </label>

            <label>
              <input type='file' onChange={forImage}></input>
              <img src={image} width='60px'></img>
            </label>

            <button onClick={addNewCategory} type='submit' className='modalButton'>Добавить</button>
            <button onClick={() => setModalNew(false)} type='submit' className='modalButton'>Отмена</button>
          </div>
        </div>
      )}

      
    </div>
  )
}