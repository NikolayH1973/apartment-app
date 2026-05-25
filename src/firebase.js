import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

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

// Save payments to Firestore (with batch operations for safety)
export const savePaymentsToFirebase = async (payments) => {
  try {
    const paymentsRef = collection(db, 'payments');
    const batch = writeBatch(db);

    // Get existing payments
    const existingPayments = await getDocs(paymentsRef);
    const existingMap = new Map();
    existingPayments.docs.forEach(docSnap => {
      const data = docSnap.data();
      existingMap.set(data.originalId, docSnap.ref);
    });

    // Mark which payments should exist
    const newIds = new Set(payments.map(p => p.id));

    // Delete payments that no longer exist
    existingMap.forEach((ref, originalId) => {
      if (!newIds.has(originalId)) {
        batch.delete(ref);
      }
    });

    // Add or update payments
    for (const payment of payments) {
      const existingRef = existingMap.get(payment.id);
      if (existingRef) {
        // Update existing
        batch.update(existingRef, {
          ...payment,
          originalId: payment.id,
          timestamp: new Date()
        });
      } else {
        // Add new with generated ID
        const newRef = doc(paymentsRef);
        batch.set(newRef, {
          ...payment,
          originalId: payment.id,
          timestamp: new Date()
        });
      }
    }

    await batch.commit();
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
    const payments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: data.originalId || doc.id // Используем originalId если есть, иначе doc.id
      };
    });
    console.log('✅ Платежи загружены из Firebase:', payments.length);
    return payments;
  } catch (error) {
    console.error('❌ Ошибка при загрузке платежей:', error);
    return [];
  }
};

// Save expenses to Firestore (with batch operations for safety)
export const saveExpensesToFirebase = async (expenses) => {
  try {
    const expensesRef = collection(db, 'expenses');
    const batch = writeBatch(db);

    const existingExpenses = await getDocs(expensesRef);
    const existingMap = new Map();
    existingExpenses.docs.forEach(docSnap => {
      const data = docSnap.data();
      existingMap.set(data.originalId, docSnap.ref);
    });

    const newIds = new Set(expenses.map(e => e.id));

    existingMap.forEach((ref, originalId) => {
      if (!newIds.has(originalId)) {
        batch.delete(ref);
      }
    });

    for (const expense of expenses) {
      const existingRef = existingMap.get(expense.id);
      if (existingRef) {
        batch.update(existingRef, {
          ...expense,
          originalId: expense.id,
          timestamp: new Date()
        });
      } else {
        const newRef = doc(expensesRef);
        batch.set(newRef, {
          ...expense,
          originalId: expense.id,
          timestamp: new Date()
        });
      }
    }

    await batch.commit();
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
    const expenses = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: data.originalId || doc.id
      };
    });
    console.log('✅ Расходы загружены из Firebase:', expenses.length);
    return expenses;
  } catch (error) {
    console.error('❌ Ошибка при загрузке расходов:', error);
    return [];
  }
};

// Save deposits to Firestore (with batch operations for safety)
export const saveDepositsToFirebase = async (deposits) => {
  try {
    const depositsRef = collection(db, 'deposits');
    const batch = writeBatch(db);

    const existingDeposits = await getDocs(depositsRef);
    const existingMap = new Map();
    existingDeposits.docs.forEach(docSnap => {
      const data = docSnap.data();
      existingMap.set(data.originalId, docSnap.ref);
    });

    const newIds = new Set(deposits.map(d => d.id));

    existingMap.forEach((ref, originalId) => {
      if (!newIds.has(originalId)) {
        batch.delete(ref);
      }
    });

    for (const deposit of deposits) {
      const existingRef = existingMap.get(deposit.id);
      if (existingRef) {
        batch.update(existingRef, {
          ...deposit,
          originalId: deposit.id,
          timestamp: new Date()
        });
      } else {
        const newRef = doc(depositsRef);
        batch.set(newRef, {
          ...deposit,
          originalId: deposit.id,
          timestamp: new Date()
        });
      }
    }

    await batch.commit();
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
    const deposits = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: data.originalId || doc.id
      };
    });
    console.log('✅ Депозиты загружены из Firebase:', deposits.length);
    return deposits;
  } catch (error) {
    console.error('❌ Ошибка при загрузке депозитов:', error);
    return [];
  }
};

// Save special income to Firestore (with batch operations for safety)
export const saveSpecialIncomeToFirebase = async (specialIncome) => {
  try {
    const incomeRef = collection(db, 'specialIncome');
    const batch = writeBatch(db);

    const existingIncome = await getDocs(incomeRef);
    const existingMap = new Map();
    existingIncome.docs.forEach(docSnap => {
      const data = docSnap.data();
      existingMap.set(data.originalId, docSnap.ref);
    });

    const newIds = new Set(specialIncome.map(i => i.id));

    existingMap.forEach((ref, originalId) => {
      if (!newIds.has(originalId)) {
        batch.delete(ref);
      }
    });

    for (const income of specialIncome) {
      const existingRef = existingMap.get(income.id);
      if (existingRef) {
        batch.update(existingRef, {
          ...income,
          originalId: income.id,
          timestamp: new Date()
        });
      } else {
        const newRef = doc(incomeRef);
        batch.set(newRef, {
          ...income,
          originalId: income.id,
          timestamp: new Date()
        });
      }
    }

    await batch.commit();
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
    const income = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: data.originalId || doc.id
      };
    });
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

// Export all data to Excel with formatting
export const exportToExcel = async (apartments = []) => {
  try {
    // Load all data from Firebase
    let payments = await loadPaymentsFromFirebase();
    let expenses = await loadExpensesFromFirebase();
    let deposits = await loadDepositsFromFirebase();
    let specialIncome = await loadSpecialIncomeFromFirebase();

    // Enrich data with apartment names
    const apartmentMap = {};
    apartments.forEach(apt => {
      apartmentMap[apt.id] = apt.name;
    });

    // Add apartment names to payments
    payments = payments.map(p => ({
      ...p,
      tenant_name: apartmentMap[p.apartment_id] || `דירה ${p.apartment_id}`
    }));

    // Add apartment names to deposits
    deposits = deposits.map(d => ({
      ...d,
      tenant_name: apartmentMap[d.apartment_id] || `דירה ${d.apartment_id}`
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Helper function to create formatted sheet
    const createFormattedSheet = (data, sheetName) => {
      const ws = XLSX.utils.json_to_sheet(data);

      // Set column widths
      const colWidths = {};
      if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
          colWidths[key] = 20;
        });
      }
      ws['!cols'] = Object.values(colWidths).map(w => ({ wch: w }));

      // Set RTL direction for Hebrew
      ws['!dir'] = 'rtl';

      // Format header row
      const headerRowKeys = data.length > 0 ? Object.keys(data[0]) : [];
      headerRowKeys.forEach((key, idx) => {
        const cellRef = XLSX.utils.encode_col(idx) + '1';
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '366092' } },
            alignment: { horizontal: 'center', vertical: 'center', rtl: true }
          };
        }
      });

      // Format number columns (денежные значения)
      data.forEach((row, rowIdx) => {
        headerRowKeys.forEach((key, colIdx) => {
          const cellRef = XLSX.utils.encode_col(colIdx) + (rowIdx + 2);
          const value = row[key];

          if (typeof value === 'number' && key.toLowerCase().includes('amount')) {
            if (ws[cellRef]) {
              ws[cellRef].s = {
                numFmt: '"₪"#,##0',
                alignment: { rtl: true }
              };
            }
          }
        });
      });

      return ws;
    };

    // Add sheets with formatting
    const paymentsSheet = createFormattedSheet(payments, 'Платежи');
    const expensesSheet = createFormattedSheet(expenses, 'Расходы');
    const depositsSheet = createFormattedSheet(deposits, 'Депозиты');
    const incomeSheet = createFormattedSheet(specialIncome, 'Доп. доходы');

    XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Платежи');
    XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Расходы');
    XLSX.utils.book_append_sheet(workbook, depositsSheet, 'Депозиты');
    XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Доп. доходы');

    // Download file with current date
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `apartment-data-${dateStr}.xlsx`);

    console.log('✅ Данные экспортированы в Excel с форматированием');
  } catch (error) {
    console.error('❌ Ошибка при экспорте в Excel:', error);
  }
};
