import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-zzUEX2EF2kCzUdaAWp4kFDpVWZTzBmQ",
  authDomain: "apartment-app-e71c0.firebaseapp.com",
  projectId: "apartment-app-e71c0",
  storageBucket: "apartment-app-e71c0.firebasestorage.app",
  messagingSenderId: "620235691057",
  appId: "1:620235691057:web:8acb2c66e59c81e379f110",
  measurementId: "G-JN3ZZ2HLY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ===== FIRESTORE FUNCTIONS =====

// Save payments to Firestore
export const savePaymentsToFirebase = async (payments) => {
  try {
    // Clear existing payments
    const paymentsRef = collection(db, 'payments');
    const existingPayments = await getDocs(paymentsRef);
    for (const doc of existingPayments.docs) {
      await deleteDoc(doc.ref);
    }

    // Add new payments
    for (const payment of payments) {
      await addDoc(paymentsRef, {
        ...payment,
        timestamp: new Date()
      });
    }
    console.log('✅ Платежи сохранены в Firebase');
  } catch (error) {
    console.error('❌ Ошибка при сохранении платежей:', error);
  }
};

// Load payments from Firestore
export const loadPaymentsFromFirebase = async () => {
  try {
    const paymentsRef = collection(db, 'payments');
    const snapshot = await getDocs(paymentsRef);
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('✅ Платежи загружены из Firebase:', payments.length);
    return payments;
  } catch (error) {
    console.error('❌ Ошибка при загрузке платежей:', error);
    return [];
  }
};

// Save expenses to Firestore
export const saveExpensesToFirebase = async (expenses) => {
  try {
    const expensesRef = collection(db, 'expenses');
    const existingExpenses = await getDocs(expensesRef);
    for (const doc of existingExpenses.docs) {
      await deleteDoc(doc.ref);
    }

    for (const expense of expenses) {
      await addDoc(expensesRef, {
        ...expense,
        timestamp: new Date()
      });
    }
    console.log('✅ Расходы сохранены в Firebase');
  } catch (error) {
    console.error('❌ Ошибка при сохранении расходов:', error);
  }
};

// Load expenses from Firestore
export const loadExpensesFromFirebase = async () => {
  try {
    const expensesRef = collection(db, 'expenses');
    const snapshot = await getDocs(expensesRef);
    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('✅ Расходы загружены из Firebase:', expenses.length);
    return expenses;
  } catch (error) {
    console.error('❌ Ошибка при загрузке расходов:', error);
    return [];
  }
};

// Save deposits to Firestore
export const saveDepositsToFirebase = async (deposits) => {
  try {
    const depositsRef = collection(db, 'deposits');
    const existingDeposits = await getDocs(depositsRef);
    for (const doc of existingDeposits.docs) {
      await deleteDoc(doc.ref);
    }

    for (const deposit of deposits) {
      await addDoc(depositsRef, {
        ...deposit,
        timestamp: new Date()
      });
    }
    console.log('✅ Депозиты сохранены в Firebase');
  } catch (error) {
    console.error('❌ Ошибка при сохранении депозитов:', error);
  }
};

// Load deposits from Firestore
export const loadDepositsFromFirebase = async () => {
  try {
    const depositsRef = collection(db, 'deposits');
    const snapshot = await getDocs(depositsRef);
    const deposits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('✅ Депозиты загружены из Firebase:', deposits.length);
    return deposits;
  } catch (error) {
    console.error('❌ Ошибка при загрузке депозитов:', error);
    return [];
  }
};

// Save special income to Firestore
export const saveSpecialIncomeToFirebase = async (specialIncome) => {
  try {
    const incomeRef = collection(db, 'specialIncome');
    const existingIncome = await getDocs(incomeRef);
    for (const doc of existingIncome.docs) {
      await deleteDoc(doc.ref);
    }

    for (const income of specialIncome) {
      await addDoc(incomeRef, {
        ...income,
        timestamp: new Date()
      });
    }
    console.log('✅ Доп. доходы сохранены в Firebase');
  } catch (error) {
    console.error('❌ Ошибка при сохранении доп. доходов:', error);
  }
};

// Load special income from Firestore
export const loadSpecialIncomeFromFirebase = async () => {
  try {
    const incomeRef = collection(db, 'specialIncome');
    const snapshot = await getDocs(incomeRef);
    const income = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('✅ Доп. доходы загружены из Firebase:', income.length);
    return income;
  } catch (error) {
    console.error('❌ Ошибка при загрузке доп. доходов:', error);
    return [];
  }
};

// Load all data at once
export const loadAllDataFromFirebase = async () => {
  try {
    const [payments, expenses, deposits, specialIncome] = await Promise.all([
      loadPaymentsFromFirebase(),
      loadExpensesFromFirebase(),
      loadDepositsFromFirebase(),
      loadSpecialIncomeFromFirebase()
    ]);

    return { payments, expenses, deposits, specialIncome };
  } catch (error) {
    console.error('❌ Ошибка при загрузке всех данных:', error);
    return { payments: [], expenses: [], deposits: [], specialIncome: [] };
  }
};

// Save all data at once
export const saveAllDataToFirebase = async (payments, expenses, deposits, specialIncome) => {
  try {
    await Promise.all([
      savePaymentsToFirebase(payments),
      saveExpensesToFirebase(expenses),
      saveDepositsToFirebase(deposits),
      saveSpecialIncomeToFirebase(specialIncome)
    ]);
    console.log('✅ Все данные сохранены в Firebase');
  } catch (error) {
    console.error('❌ Ошибка при сохранении всех данных:', error);
  }
};
