import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Expenses from './Components/Expenses';
import Incomes from './Components/Incomes';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const [content, setContent] = useState(false);
  const [statistic, setStatic] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSpentIncomes, setTotalSpentIncomes] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesIncomes, setCategoriesIncomes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryIncomes, setSelectedCategoryIncomes] = useState("");
  const [sortByPrice, setSortByPrice] = useState('asc');
  const [search, setSearch] = useState('');

  const loc = useLocation();

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (savedExpenses) {
      setExpenses(savedExpenses);
    }

    axios.get('http://localhost:8080/category')
      .then(response => {
        setCategories(response.data);
      });
  }, []);

  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.summa), 0);
    setTotalSpent(total);
  }, [expenses]);

  useEffect(() => {
    const totalIncomes = incomes.reduce((acc, income) => acc + parseFloat(income.summa), 0);
    setTotalSpentIncomes(totalIncomes);
  }, [incomes]);

  const filterCategory = () => {
    let filteredCategory = expenses;
    if (search) {
      filteredCategory = filteredCategory.filter(expense => {
        return expense.comment.toLowerCase().includes(search.toLowerCase());
      });
    }
    if (sortByPrice === 'asc') {
      filteredCategory = filteredCategory.sort((a, b) => parseFloat(a.summa) - parseFloat(b.summa));
    } else if (sortByPrice === 'desc') {
      filteredCategory = filteredCategory.sort((a, b) => parseFloat(b.summa) - parseFloat(a.summa));
    }
    return filteredCategory;
  };

  const filterCategoryIncomes = () => {
    let filteredCategoryIncomes = incomes;
    if (search) {
      filteredCategoryIncomes = filteredCategoryIncomes.filter(income => {
        return income.comment.toLowerCase().includes(search.toLowerCase());
      });
    }
    if (sortByPrice === 'asc') {
      filteredCategoryIncomes = filteredCategoryIncomes.sort((a, b) => parseFloat(a.summa) - parseFloat(b.summa));
    } else if (sortByPrice === 'desc') {
      filteredCategoryIncomes = filteredCategoryIncomes.sort((a, b) => parseFloat(b.summa) - parseFloat(a.summa));
    }
    return filteredCategoryIncomes;
  };

  const funcContent = (openContent) => {
    setStatic(openContent);
    setContent(true);
  };

  const onSave = (expensesData) => {
    setExpenses([...expenses, expensesData]);
    localStorage.setItem('expenses', JSON.stringify([...expenses, expensesData]));
  };

  const onSaveIncomes = (incomesData) => {
    setIncomes([...incomes, incomesData]);
    localStorage.setItem('incomes', JSON.stringify([...incomes, incomesData]));
  };

  const deleteExpense = (expenseId) => {
    const indexToDelete = expenses.findIndex(expense => expense.id === expenseId);
    if (indexToDelete !== -1) {
      const updatedExpenses = [...expenses.slice(0, indexToDelete), ...expenses.slice(indexToDelete + 1)];
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    }
  };

  const onAddNewCategory = (newCategoryObj) => {
    setCategories([...categories, newCategoryObj]);
  };

  const onAddNewCategoryIncomes = (newCategoryObj) => {
    setCategoriesIncomes([...categoriesIncomes, newCategoryObj]);
  };

  return (
    <div className='all-site'>
      <div className='static-menu'>
        <h1>Учёт финансов</h1>
        <div className='static-menu'>
          <ul>
            <li className='list-menu'><Link to="/">Статистика</Link></li>
            <li className='list-menu'><Link to="/expenses">Расходы</Link></li>
            <li className='list-menu'><Link to="/incomes">Доходы</Link></li>
          </ul>
        </div>
      </div>

      <div className='non-static-content'>
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/expenses" element={<Expenses onSave={onSave} categories={categories} expenses={expenses}  selectedCategory={selectedCategory} onAddNewCategory={onAddNewCategory} sortByPrice={sortByPrice} setSelectedCategory={selectedCategory}/>} />
          <Route path="/incomes" element={<Incomes onSaveIncomes={onSaveIncomes} onAddNewCategoryIncomes={onAddNewCategoryIncomes} categoriesIncomes={categoriesIncomes} incomes={incomes} setCategoriesIncomes={setCategoriesIncomes}/>} />
        </Routes>

        {loc.pathname === '/' && (
          <div className='main-page'>
            <button onClick={() => funcContent('/expenses')} className='expenses-content modalButton' >Расходы</button>
            <button onClick={() => funcContent('/incomes')} className='incomes-content modalButton'>Доходы</button>

            {content && statistic && (
              <div>
                {statistic === '/expenses' && (
                  <div>
                    <h1>Расходы</h1>
            
                    <div className='first-line'>
                      <input placeholder='поиск...' value={search} onChange={(e)=>setSearch(e.target.value)}></input>
                      <p>Всего потрачено: {totalSpent}</p>
                    </div>

                    <div className='second-line'>
                      <select onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value='' disabled>Сортировать по категории</option>
                        <option value=''>Все</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                            
                      <select onChange={(e)=> setSortByPrice(e.target.value)}>
                        <option value='' disabled>Сортировать по цене</option>
                        <option value=''>Все</option>
                      <option value= 'asc' onClick={()=>setSortByPrice('asc')}>Сначала дешевые</option>
                             <option value='desc' onClick={()=>setSortByPrice('desc')}>Сначала дорогие</option>
                      </select>
                
                    </div>

                    <div className='third-line'>
                      {filterCategory().map((expense, i) => (
                        <div className='exContent' key={i}>
                          <h2> </h2>
                          <p>Дата: {expense.date}</p>
                          <p>Сумма: {expense.summa}</p>
                          <p>Комментарий: {expense.comment}</p>
                          <button onClick={() => deleteExpense(expense.id)} className='modalButton'>Удалить</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {statistic === '/incomes' && (
                   <div>
                   <h1>Доходы</h1>
           
                   <div className='first-line'>
                     <input placeholder='поиск...' value={search} onChange={(e)=>setSearch(e.target.value)}></input>
                     <p>Всего потрачено: {totalSpentIncomes}</p>
                   </div>

                   <div className='second-line'>
                     <select onChange={(e) => setSelectedCategoryIncomes(e.target.value)}>
                       <option value='' disabled>Сортировать по категории</option>
                       <option value=''>Все</option>
                       {categoriesIncomes.map(category => (
                         <option key={category.id} value={category.name}>{category.name}</option>
                       ))}
                     </select>
                           
                     <select onChange={(e)=> setSortByPrice(e.target.value)}>
                       <option value='' disabled>Сортировать по цене</option>
                       <option value=''>Все</option>
                     <option value= 'asc' onClick={()=>setSortByPrice('asc')}>Сначала дешевые</option>
                            <option value='desc' onClick={()=>setSortByPrice('desc')}>Сначала дорогие</option>
                     </select>
               
                   </div>

                   <div className='third-line'>
                     {filterCategoryIncomes().map((income, i) => (
                       <div className='exContent' key={i}>
                         <h2> </h2>
                         <p>Дата: {income.date}</p>
                         <p>Сумма: {income.summa}</p>
                         <p>Комментарий: {income.comment}</p>
                         <button onClick={() => deleteExpense(income.id)} className='modalButton'>Удалить</button>
                       </div>
                     ))}
                   </div>
                 </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;