"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type SectionName =
  | "Home"
  | "Production"
  | "Inventory"
  | "Customers"
  | "Companies"
  | "Employees"
  | "Users"
  | "Expense Types"
  | "Settings"
  | "Dashboards";

type Company = {
  id: number;
  name: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  city: string;
  state: string;
};

type Employee = {
  id: number;
  name: string;
  phone: string;
};

type UserRecord = {
  id: number;
  name: string;
  username: string;
  password: string;
};

type InventoryItem = {
  id: number;
  description: string;
  vn: string;
  value: string;
  plate: string;
  photos: string[];
};

type ExpenseType = {
  id: number;
  name: string;
};

type ProductionExpense = {
  expenseTypeId: string;
  value: string;
};

type ProductionRecord = {
  id: number;
  number: number;
  group: string;
  ft: string;
  date: string;
  companyId: string;
  customerId: string;
  hh17x30: string;
  hh24x36: string;
  costFt: string;
  valueFt: string;
  costHh: string;
  valueHh: string;
  expenses: ProductionExpense[];
};

const emptyCompany = {
  name: "",
  street: "",
  number: "",
  city: "",
  state: "",
};

const emptyCustomer = {
  name: "",
  phone: "",
  city: "",
  state: "",
};

const emptyEmployee = {
  name: "",
  phone: "",
};

const emptyUser = {
  name: "",
  password: "",
  username: "",
};

const emptyInventoryItem = {
  description: "",
  photos: [] as string[],
  vn: "",
  value: "",
  plate: "",
};

const emptyExpenseType = {
  name: "",
};

const emptyProduction = {
  group: "",
  ft: "",
  date: "",
  companyId: "",
  customerId: "",
  hh17x30: "",
  hh24x36: "",
  costFt: "",
  valueFt: "",
  costHh: "",
  valueHh: "",
};

const emptyProductionExpense = {
  expenseTypeId: "",
  value: "",
};

type ApiEnvelope<T> = {
  data?: T;
  error?: string;
};

async function apiRequest<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload.data as T;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionName>("Home");
  const [loginForm, setLoginForm] = useState({ password: "", username: "" });
  const [loginError, setLoginError] = useState("");
  const [activeDashboard, setActiveDashboard] = useState("Summary");
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 1, name: "Admin", password: "admin", username: "admin" },
  ]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>(
    [],
  );
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [employeeForm, setEmployeeForm] = useState(emptyEmployee);
  const [userForm, setUserForm] = useState(emptyUser);
  const [inventoryForm, setInventoryForm] = useState(emptyInventoryItem);
  const [expenseTypeForm, setExpenseTypeForm] = useState(emptyExpenseType);
  const [productionForm, setProductionForm] = useState(emptyProduction);
  const [productionExpenses, setProductionExpenses] = useState<
    ProductionExpense[]
  >([{ ...emptyProductionExpense }]);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingInventoryId, setEditingInventoryId] = useState<number | null>(
    null,
  );
  const [editingExpenseTypeId, setEditingExpenseTypeId] = useState<
    number | null
  >(null);
  const [editingProductionId, setEditingProductionId] = useState<number | null>(
    null,
  );
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isExpenseTypeModalOpen, setIsExpenseTypeModalOpen] = useState(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState("");
  const [productionDateFrom, setProductionDateFrom] = useState("");
  const [productionDateTo, setProductionDateTo] = useState("");
  const [productionCompanyFilter, setProductionCompanyFilter] = useState("");
  const [productionGroupFilter, setProductionGroupFilter] = useState("");
  const [dashboardDateFrom, setDashboardDateFrom] = useState("");
  const [dashboardDateTo, setDashboardDateTo] = useState("");
  const [dashboardCompanyFilter, setDashboardCompanyFilter] = useState("");
  const [dashboardGroupFilter, setDashboardGroupFilter] = useState("");
  const [dashboardExpenseTypeFilter, setDashboardExpenseTypeFilter] =
    useState("");
  const [productionDetail, setProductionDetail] =
    useState<ProductionRecord | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const menuItems = [
    { label: "Home", description: "Main workspace", icon: "HO" },
    { label: "Dashboards", description: "System overview and analytics", icon: "DA" },
    { label: "Production", description: "Manage production orders", icon: "PR" },
    { label: "Inventory", description: "Control stock and supplies", icon: "IN" },
    { label: "Customers", description: "Manage customer records", icon: "CU" },
    { label: "Companies", description: "Company records and units", icon: "CO" },
    { label: "Employees", description: "Team records and access", icon: "EM" },
    { label: "Users", description: "Manage system users", icon: "US" },
    { label: "Expense Types", description: "Manage expense categories", icon: "EX" },
  ] satisfies Array<{
    label: SectionName;
    description: string;
    icon: string;
  }>;

  const dashboardOptions = [
    "Summary",
    "Production Report",
    "Inventory Report",
    "Customers Report",
    "Companies Report",
    "Employees Report",
    "Expense Report",
    "Expense Totals",
    "Financial Analysis",
    "TOP Companies",
    "TOP Customers",
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    async function loadData() {
      const [
        companyData,
        customerData,
        employeeData,
        userData,
        inventoryData,
        expenseTypeData,
        productionData,
      ] = await Promise.all([
        apiRequest<Company[]>("/api/companies"),
        apiRequest<Customer[]>("/api/customers"),
        apiRequest<Employee[]>("/api/employees"),
        apiRequest<UserRecord[]>("/api/users"),
        apiRequest<InventoryItem[]>("/api/inventory"),
        apiRequest<ExpenseType[]>("/api/expense-types"),
        apiRequest<ProductionRecord[]>("/api/production"),
      ]);

      setCompanies(companyData);
      setCustomers(customerData);
      setEmployees(employeeData);
      setUsers(userData);
      setInventoryItems(inventoryData);
      setExpenseTypes(expenseTypeData);
      setProductionRecords(productionData);
    }

    loadData().catch((error) => setLoginError(error.message));
  }, [isLoggedIn]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await apiRequest<UserRecord>("/api/auth/login", {
        body: JSON.stringify(loginForm),
        method: "POST",
      });
      setIsLoggedIn(true);
      setIsMenuOpen(false);
      setLoginError("");
    } catch (error) {
      setLoginError((error as Error).message);
    }
  }

  function handleSectionChange(section: SectionName) {
    setActiveSection(section);
    setIsMenuOpen(false);
    setIsDashboardMenuOpen(false);
  }

  function exportDashboardToPdf() {
    const report = document.getElementById("dashboard-report");
    const printWindow = window.open("", "_blank", "width=960,height=720");

    if (!report || !printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${activeDashboard}</title>
          <style>
            body {
              color: #0f172a;
              font-family: Arial, Helvetica, sans-serif;
              padding: 32px;
            }

            article,
            section,
            div {
              box-sizing: border-box;
            }

            article {
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              margin-bottom: 12px;
              padding: 16px;
            }

            h3 {
              margin-top: 28px;
            }

            p {
              margin: 4px 0;
            }
          </style>
        </head>
        <body>
          <h1>${activeDashboard}</h1>
          ${report.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  async function saveCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingCompanyId) {
      const savedCompany = await apiRequest<Company>("/api/companies", {
        body: JSON.stringify({ id: editingCompanyId, ...companyForm }),
        method: "PUT",
      });
      setCompanies((current) =>
        current.map((company) =>
          company.id === editingCompanyId ? savedCompany : company,
        ),
      );
      setEditingCompanyId(null);
    } else {
      const savedCompany = await apiRequest<Company>("/api/companies", {
        body: JSON.stringify(companyForm),
        method: "POST",
      });
      setCompanies((current) => [...current, savedCompany]);
    }

    setCompanyForm(emptyCompany);
    setIsCompanyModalOpen(false);
  }

  function editCompany(company: Company) {
    setCompanyForm({
      name: company.name,
      street: company.street,
      number: company.number,
      city: company.city,
      state: company.state,
    });
    setEditingCompanyId(company.id);
    setIsCompanyModalOpen(true);
  }

  async function deleteCompany(id: number) {
    await apiRequest(`/api/companies?id=${id}`, { method: "DELETE" });
    setCompanies((current) => current.filter((company) => company.id !== id));

    if (editingCompanyId === id) {
      setEditingCompanyId(null);
      setCompanyForm(emptyCompany);
      setIsCompanyModalOpen(false);
    }
  }

  async function saveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingCustomerId) {
      const savedCustomer = await apiRequest<Customer>("/api/customers", {
        body: JSON.stringify({ id: editingCustomerId, ...customerForm }),
        method: "PUT",
      });
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingCustomerId ? savedCustomer : customer,
        ),
      );
      setEditingCustomerId(null);
    } else {
      const savedCustomer = await apiRequest<Customer>("/api/customers", {
        body: JSON.stringify(customerForm),
        method: "POST",
      });
      setCustomers((current) => [...current, savedCustomer]);
    }

    setCustomerForm(emptyCustomer);
    setIsCustomerModalOpen(false);
  }

  function editCustomer(customer: Customer) {
    setCustomerForm({
      name: customer.name,
      phone: customer.phone,
      city: customer.city,
      state: customer.state,
    });
    setEditingCustomerId(customer.id);
    setIsCustomerModalOpen(true);
  }

  async function deleteCustomer(id: number) {
    await apiRequest(`/api/customers?id=${id}`, { method: "DELETE" });
    setCustomers((current) => current.filter((customer) => customer.id !== id));

    if (editingCustomerId === id) {
      setEditingCustomerId(null);
      setCustomerForm(emptyCustomer);
      setIsCustomerModalOpen(false);
    }
  }

  async function saveEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingEmployeeId) {
      const savedEmployee = await apiRequest<Employee>("/api/employees", {
        body: JSON.stringify({ id: editingEmployeeId, ...employeeForm }),
        method: "PUT",
      });
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === editingEmployeeId ? savedEmployee : employee,
        ),
      );
      setEditingEmployeeId(null);
    } else {
      const savedEmployee = await apiRequest<Employee>("/api/employees", {
        body: JSON.stringify(employeeForm),
        method: "POST",
      });
      setEmployees((current) => [...current, savedEmployee]);
    }

    setEmployeeForm(emptyEmployee);
    setIsEmployeeModalOpen(false);
  }

  function editEmployee(employee: Employee) {
    setEmployeeForm({
      name: employee.name,
      phone: employee.phone,
    });
    setEditingEmployeeId(employee.id);
    setIsEmployeeModalOpen(true);
  }

  async function deleteEmployee(id: number) {
    await apiRequest(`/api/employees?id=${id}`, { method: "DELETE" });
    setEmployees((current) => current.filter((employee) => employee.id !== id));

    if (editingEmployeeId === id) {
      setEditingEmployeeId(null);
      setEmployeeForm(emptyEmployee);
      setIsEmployeeModalOpen(false);
    }
  }

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingUserId) {
      const savedUser = await apiRequest<UserRecord>("/api/users", {
        body: JSON.stringify({ id: editingUserId, ...userForm }),
        method: "PUT",
      });
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUserId ? savedUser : user,
        ),
      );
      setEditingUserId(null);
    } else {
      const savedUser = await apiRequest<UserRecord>("/api/users", {
        body: JSON.stringify(userForm),
        method: "POST",
      });
      setUsers((current) => [...current, savedUser]);
    }

    setUserForm(emptyUser);
    setIsUserModalOpen(false);
  }

  function editUser(user: UserRecord) {
    setUserForm({
      name: user.name,
      password: user.password,
      username: user.username,
    });
    setEditingUserId(user.id);
    setIsUserModalOpen(true);
  }

  async function deleteUser(id: number) {
    if (users.length === 1) {
      return;
    }

    await apiRequest(`/api/users?id=${id}`, { method: "DELETE" });
    setUsers((current) => current.filter((user) => user.id !== id));

    if (editingUserId === id) {
      setEditingUserId(null);
      setUserForm(emptyUser);
      setIsUserModalOpen(false);
    }
  }

  function getNextInventoryId() {
    return inventoryItems.length === 0
      ? 1
      : Math.max(...inventoryItems.map((item) => item.id)) + 1;
  }

  async function saveInventoryItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingInventoryId) {
      const savedItem = await apiRequest<InventoryItem>("/api/inventory", {
        body: JSON.stringify({ id: editingInventoryId, ...inventoryForm }),
        method: "PUT",
      });
      setInventoryItems((current) =>
        current.map((item) =>
          item.id === editingInventoryId ? savedItem : item,
        ),
      );
      setEditingInventoryId(null);
    } else {
      const savedItem = await apiRequest<InventoryItem>("/api/inventory", {
        body: JSON.stringify(inventoryForm),
        method: "POST",
      });
      setInventoryItems((current) => [...current, savedItem]);
    }

    setInventoryForm(emptyInventoryItem);
    setIsInventoryModalOpen(false);
  }

  function editInventoryItem(item: InventoryItem) {
    setInventoryForm({
      description: item.description,
      plate: item.plate,
      photos: item.photos,
      value: item.value,
      vn: item.vn,
    });
    setEditingInventoryId(item.id);
    setIsInventoryModalOpen(true);
  }

  async function deleteInventoryItem(id: number) {
    await apiRequest(`/api/inventory?id=${id}`, { method: "DELETE" });
    setInventoryItems((current) => current.filter((item) => item.id !== id));

    if (editingInventoryId === id) {
      setEditingInventoryId(null);
      setInventoryForm(emptyInventoryItem);
      setIsInventoryModalOpen(false);
    }
  }

  function getNextProductionNumber() {
    return productionRecords.length === 0
      ? 1
      : Math.max(...productionRecords.map((record) => record.number)) + 1;
  }

  async function saveExpenseType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingExpenseTypeId) {
      const savedExpenseType = await apiRequest<ExpenseType>(
        "/api/expense-types",
        {
          body: JSON.stringify({ id: editingExpenseTypeId, ...expenseTypeForm }),
          method: "PUT",
        },
      );
      setExpenseTypes((current) =>
        current.map((expenseType) =>
          expenseType.id === editingExpenseTypeId
            ? savedExpenseType
            : expenseType,
        ),
      );
      setEditingExpenseTypeId(null);
    } else {
      const savedExpenseType = await apiRequest<ExpenseType>(
        "/api/expense-types",
        {
          body: JSON.stringify(expenseTypeForm),
          method: "POST",
        },
      );
      setExpenseTypes((current) => [...current, savedExpenseType]);
    }

    setExpenseTypeForm(emptyExpenseType);
    setIsExpenseTypeModalOpen(false);
  }

  function editExpenseType(expenseType: ExpenseType) {
    setExpenseTypeForm({ name: expenseType.name });
    setEditingExpenseTypeId(expenseType.id);
    setIsExpenseTypeModalOpen(true);
  }

  async function deleteExpenseType(id: number) {
    await apiRequest(`/api/expense-types?id=${id}`, { method: "DELETE" });
    setExpenseTypes((current) =>
      current.filter((expenseType) => expenseType.id !== id),
    );

    if (editingExpenseTypeId === id) {
      setEditingExpenseTypeId(null);
      setExpenseTypeForm(emptyExpenseType);
      setIsExpenseTypeModalOpen(false);
    }
  }

  async function saveProduction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const expenses = productionExpenses.filter(
      (expense) => expense.expenseTypeId && expense.value,
    );

    if (editingProductionId) {
      const savedProduction = await apiRequest<ProductionRecord>(
        "/api/production",
        {
          body: JSON.stringify({
            id: editingProductionId,
            ...productionForm,
            expenses,
          }),
          method: "PUT",
        },
      );
      setProductionRecords((current) =>
        current.map((record) =>
          record.id === editingProductionId ? savedProduction : record,
        ),
      );
      setEditingProductionId(null);
    } else {
      const savedProduction = await apiRequest<ProductionRecord>(
        "/api/production",
        {
          body: JSON.stringify({ ...productionForm, expenses }),
          method: "POST",
        },
      );
      setProductionRecords((current) => [...current, savedProduction]);
    }

    setProductionForm(emptyProduction);
    setProductionExpenses([{ ...emptyProductionExpense }]);
    setIsProductionModalOpen(false);
  }

  function editProduction(record: ProductionRecord) {
    setProductionForm({
      group: record.group,
      ft: record.ft,
      date: record.date,
      companyId: record.companyId,
      customerId: record.customerId,
      hh17x30: record.hh17x30,
      hh24x36: record.hh24x36,
      costFt: record.costFt,
      valueFt: record.valueFt,
      costHh: record.costHh,
      valueHh: record.valueHh,
    });
    setProductionExpenses(
      record.expenses.length > 0
        ? record.expenses
        : [{ ...emptyProductionExpense }],
    );
    setEditingProductionId(record.id);
    setIsProductionModalOpen(true);
  }

  async function deleteProduction(id: number) {
    await apiRequest(`/api/production?id=${id}`, { method: "DELETE" });
    setProductionRecords((current) =>
      current.filter((record) => record.id !== id),
    );

    if (editingProductionId === id) {
      setEditingProductionId(null);
      setProductionForm(emptyProduction);
      setProductionExpenses([{ ...emptyProductionExpense }]);
      setIsProductionModalOpen(false);
    }
  }

  function updateProductionExpense(
    index: number,
    field: keyof ProductionExpense,
    value: string,
  ) {
    setProductionExpenses((current) =>
      current.map((expense, currentIndex) =>
        currentIndex === index ? { ...expense, [field]: value } : expense,
      ),
    );
  }

  function addProductionExpense() {
    setProductionExpenses((current) => [
      ...current,
      { ...emptyProductionExpense },
    ]);
  }

  function removeProductionExpense(index: number) {
    setProductionExpenses((current) =>
      current.length === 1
        ? [{ ...emptyProductionExpense }]
        : current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function getCompanyName(id: string) {
    return companies.find((company) => String(company.id) === id)?.name ?? "";
  }

  function getCustomerName(id: string) {
    return customers.find((customer) => String(customer.id) === id)?.name ?? "";
  }

  function getExpenseTypeName(id: string) {
    return (
      expenseTypes.find((expenseType) => String(expenseType.id) === id)?.name ??
      "Unknown"
    );
  }

  function toNumber(value: string) {
    return Number(value || 0);
  }

  function formatMoney(value: number) {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency",
    }).format(value);
  }

  function formatDate(value: string) {
    if (!value) {
      return "Not informed";
    }

    const parsedDate = parseUsDate(value);

    if (!parsedDate) {
      return value;
    }

    return new Intl.DateTimeFormat("en-US").format(parsedDate);
  }

  function parseUsDate(value: string) {
    if (!value) {
      return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T00:00:00`);
    }

    const [month, day, year] = value.split("/").map(Number);

    if (!month || !day || !year) {
      return null;
    }

    return new Date(year, month - 1, day);
  }

  function calculateProduction(record: ProductionRecord) {
    const ftQuantity = toNumber(record.ft);
    const hhQuantity = toNumber(record.hh17x30) + toNumber(record.hh24x36);
    const ftValue = ftQuantity * toNumber(record.valueFt);
    const ftCost = ftQuantity * toNumber(record.costFt);
    const hhValue = hhQuantity * toNumber(record.valueHh);
    const hhCost = hhQuantity * toNumber(record.costHh);
    const expenseTotal = record.expenses.reduce(
      (total, expense) => total + toNumber(expense.value),
      0,
    );
    const totalValue = ftValue + hhValue;
    const totalCost = ftCost + hhCost;
    const netValue = totalValue - totalCost - expenseTotal;

    return {
      expenseTotal,
      ftCost,
      ftQuantity,
      ftValue,
      hhCost,
      hhQuantity,
      hhValue,
      netValue,
      totalCost,
      totalValue,
    };
  }

  function renderActiveSection() {
    if (activeSection === "Dashboards") {
      const dashboardProductionRecords = productionRecords.filter((record) =>
        (!dashboardDateFrom ||
          (Boolean(parseUsDate(record.date)) &&
            Boolean(parseUsDate(dashboardDateFrom)) &&
            parseUsDate(record.date)! >= parseUsDate(dashboardDateFrom)!)) &&
        (!dashboardDateTo ||
          (Boolean(parseUsDate(record.date)) &&
            Boolean(parseUsDate(dashboardDateTo)) &&
            parseUsDate(record.date)! <= parseUsDate(dashboardDateTo)!)) &&
        (!dashboardCompanyFilter ||
          record.companyId === dashboardCompanyFilter) &&
        record.group.toLowerCase().includes(dashboardGroupFilter.toLowerCase()),
      );

      const productionTotals = dashboardProductionRecords.reduce(
        (totals, record) => {
          const current = calculateProduction(record);

          return {
            expenseTotal: totals.expenseTotal + current.expenseTotal,
            netValue: totals.netValue + current.netValue,
            totalValue: totals.totalValue + current.totalValue,
          };
        },
        { expenseTotal: 0, netValue: 0, totalValue: 0 },
      );
      const dashboardExpenseEntries = dashboardProductionRecords.flatMap(
        (record) =>
          record.expenses.map((expense) => ({
            expense,
            productionNumber: record.number,
          })),
      );
      const filteredDashboardExpenses = dashboardExpenseEntries.filter(
        ({ expense }) =>
          !dashboardExpenseTypeFilter ||
          expense.expenseTypeId === dashboardExpenseTypeFilter,
      );
      const filteredExpenseTotal = filteredDashboardExpenses.reduce(
        (total, { expense }) => total + toNumber(expense.value),
        0,
      );
      const expenseTotalsByType = expenseTypes
        .map((expenseType) => {
          const entries = filteredDashboardExpenses.filter(
            ({ expense }) => expense.expenseTypeId === String(expenseType.id),
          );

          return {
            count: entries.length,
            name: expenseType.name,
            total: entries.reduce(
              (sum, { expense }) => sum + toNumber(expense.value),
              0,
            ),
          };
        })
        .filter((item) => item.count > 0);

      const dashboardCards =
        {
        "Companies Report": [
          { label: "Companies", value: String(companies.length) },
          { label: "Production Companies", value: String(companies.length) },
          { label: "Active Records", value: String(companies.length) },
        ],
        "Customers Report": [
          { label: "Customers", value: String(customers.length) },
          { label: "Customer Cities", value: String(customers.length) },
          { label: "Active Records", value: String(customers.length) },
        ],
        "Employees Report": [
          { label: "Employees", value: String(employees.length) },
          { label: "Phone Records", value: String(employees.length) },
          { label: "Active Records", value: String(employees.length) },
        ],
        "Expense Report": [
          { label: "Expense Types", value: String(expenseTypes.length) },
          { label: "Expense Total", value: formatMoney(filteredExpenseTotal) },
          { label: "Production Records", value: String(dashboardProductionRecords.length) },
        ],
        "Expense Totals": [
          { label: "Expense Total", value: formatMoney(filteredExpenseTotal) },
          { label: "Expense Entries", value: String(filteredDashboardExpenses.length) },
          { label: "Expense Types", value: String(expenseTotalsByType.length) },
        ],
        "Financial Analysis": [
          { label: "Total Value", value: formatMoney(productionTotals.totalValue) },
          { label: "Expenses", value: formatMoney(productionTotals.expenseTotal) },
          { label: "Net Value", value: formatMoney(productionTotals.netValue) },
        ],
        "Inventory Report": [
          { label: "Inventory Items", value: String(inventoryItems.length) },
          {
            label: "Inventory Value",
            value: formatMoney(
              inventoryItems.reduce((total, item) => total + toNumber(item.value), 0),
            ),
          },
          { label: "Active Records", value: String(inventoryItems.length) },
        ],
        "Production Report": [
          { label: "Production Records", value: String(dashboardProductionRecords.length) },
          { label: "Total Value", value: formatMoney(productionTotals.totalValue) },
          { label: "Net Value", value: formatMoney(productionTotals.netValue) },
        ],
        Summary: [
          { label: "Production Records", value: String(dashboardProductionRecords.length) },
          { label: "Inventory Items", value: String(inventoryItems.length) },
          { label: "Net Value", value: formatMoney(productionTotals.netValue) },
        ],
        "TOP Companies": [
          { label: "Registered Companies", value: String(companies.length) },
          { label: "Best Company", value: companies[0]?.name ?? "No data" },
          { label: "Records", value: String(dashboardProductionRecords.length) },
        ],
        "TOP Customers": [
          { label: "Registered Customers", value: String(customers.length) },
          { label: "Best Customer", value: customers[0]?.name ?? "No data" },
          { label: "Records", value: String(dashboardProductionRecords.length) },
        ],
        }[activeDashboard] ?? [];

      return (
        <RegistryPanel
          description="Choose a dashboard type and review key indicators."
          title="Dashboards"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <button
                className="flex min-w-56 items-center justify-between gap-4 rounded-xl bg-slate-950 px-5 py-3 text-left text-sm font-bold text-white"
                onClick={() => setIsDashboardMenuOpen((current) => !current)}
                type="button"
              >
                {activeDashboard}
                <svg
                  aria-hidden="true"
                  className={`h-5 w-5 transition ${
                    isDashboardMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isDashboardMenuOpen ? (
                <div className="absolute left-0 top-12 z-20 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {dashboardOptions.map((option) => (
                    <button
                      className={`block w-full px-5 py-3 text-left text-sm transition ${
                        activeDashboard === option
                          ? "bg-slate-100 font-bold text-slate-950"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      key={option}
                      onClick={() => {
                        setActiveDashboard(option);
                        setIsDashboardMenuOpen(false);
                      }}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              className="text-left text-sm font-bold text-slate-600 transition hover:text-slate-950"
              onClick={() => {
                setActiveDashboard("Summary");
                setDashboardDateFrom("");
                setDashboardDateTo("");
                setDashboardCompanyFilter("");
                setDashboardGroupFilter("");
                setDashboardExpenseTypeFilter("");
              }}
              type="button"
            >
              Clear filters
            </button>

            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              onClick={exportDashboardToPdf}
              type="button"
            >
              Export PDF
            </button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <FilterField
              label="Date from"
              onChange={setDashboardDateFrom}
              placeholder="MM/DD/YYYY"
              type="date"
              value={dashboardDateFrom}
            />
            <FilterField
              label="Date to"
              onChange={setDashboardDateTo}
              placeholder="MM/DD/YYYY"
              type="date"
              value={dashboardDateTo}
            />
            <SelectField
              label="Company"
              onChange={setDashboardCompanyFilter}
              options={companies.map((company) => ({
                label: company.name,
                value: String(company.id),
              }))}
              placeholder="All companies"
              required={false}
              value={dashboardCompanyFilter}
            />
            <FilterField
              label="Group"
              onChange={setDashboardGroupFilter}
              value={dashboardGroupFilter}
            />
            <SelectField
              label="Expense Type"
              onChange={setDashboardExpenseTypeFilter}
              options={expenseTypes.map((expenseType) => ({
                label: expenseType.name,
                value: String(expenseType.id),
              }))}
              placeholder="All expense types"
              required={false}
              value={dashboardExpenseTypeFilter}
            />
          </div>

          <div id="dashboard-report">
            <div className="grid gap-4 md:grid-cols-3">
              {dashboardCards.map((card) => (
                <MetricCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                />
              ))}
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-bold">
                {activeDashboard} Details
              </h3>
              <div className="grid gap-3">
              {activeDashboard === "Inventory Report" ? (
                inventoryItems.length === 0 ? (
                  <EmptyState message="No inventory details found." />
                ) : (
                  inventoryItems.map((item) => (
                    <DashboardDetailRow
                      key={item.id}
                      title={`Inventory #${item.id}`}
                      value={formatMoney(toNumber(item.value))}
                    >
                      {item.description} | VN: {item.vn} | Plate: {item.plate}
                    </DashboardDetailRow>
                  ))
                )
              ) : null}

              {activeDashboard === "Customers Report" ||
              activeDashboard === "TOP Customers" ? (
                customers.length === 0 ? (
                  <EmptyState message="No customer details found." />
                ) : (
                  customers.map((customer) => (
                    <DashboardDetailRow
                      key={customer.id}
                      title={customer.name}
                      value={customer.phone}
                    >
                      {customer.city}, {customer.state}
                    </DashboardDetailRow>
                  ))
                )
              ) : null}

              {activeDashboard === "Companies Report" ||
              activeDashboard === "TOP Companies" ? (
                companies.length === 0 ? (
                  <EmptyState message="No company details found." />
                ) : (
                  companies.map((company) => (
                    <DashboardDetailRow
                      key={company.id}
                      title={company.name}
                      value={company.state}
                    >
                      {company.street}, {company.number} | {company.city}
                    </DashboardDetailRow>
                  ))
                )
              ) : null}

              {activeDashboard === "Employees Report" ? (
                employees.length === 0 ? (
                  <EmptyState message="No employee details found." />
                ) : (
                  employees.map((employee) => (
                    <DashboardDetailRow
                      key={employee.id}
                      title={employee.name}
                      value={employee.phone}
                    >
                      Employee record
                    </DashboardDetailRow>
                  ))
                )
              ) : null}

              {activeDashboard === "Expense Totals" ? (
                expenseTotalsByType.length === 0 ? (
                  <EmptyState message="No expense totals found." />
                ) : (
                  expenseTotalsByType.map((item) => (
                    <DashboardDetailRow
                      key={item.name}
                      title={item.name}
                      value={formatMoney(item.total)}
                    >
                      Entries: {item.count}
                    </DashboardDetailRow>
                  ))
                )
              ) : null}

              {[
                "Summary",
                "Production Report",
                "Expense Report",
                "Financial Analysis",
              ].includes(activeDashboard) ? (
                dashboardProductionRecords.length === 0 ? (
                  <EmptyState message="No production details found." />
                ) : (
                  dashboardProductionRecords.map((record) => {
                    const totals = calculateProduction(record);

                    return (
                      <DashboardDetailRow
                        key={record.id}
                        title={`Production #${record.number}`}
                        value={formatMoney(totals.netValue)}
                      >
                        {formatDate(record.date)} | {getCompanyName(record.companyId)} |{" "}
                        {record.group} | Total: {formatMoney(totals.totalValue)}
                      </DashboardDetailRow>
                    );
                  })
                )
              ) : null}
              </div>
            </div>
          </div>
        </RegistryPanel>
      );
    }

    if (activeSection === "Production") {
      const filteredProductionRecords = productionRecords.filter((record) =>
        (!productionDateFrom ||
          Boolean(parseUsDate(record.date)) &&
            Boolean(parseUsDate(productionDateFrom)) &&
            parseUsDate(record.date)! >= parseUsDate(productionDateFrom)!) &&
        (!productionDateTo ||
          Boolean(parseUsDate(record.date)) &&
            Boolean(parseUsDate(productionDateTo)) &&
            parseUsDate(record.date)! <= parseUsDate(productionDateTo)!) &&
        (!productionCompanyFilter ||
          record.companyId === productionCompanyFilter) &&
        record.group
          .toLowerCase()
          .includes(productionGroupFilter.toLowerCase()),
      );

      return (
        <>
          <RegistryPanel
            action={
              <button
                aria-label="New production"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                onClick={() => {
                  setProductionForm(emptyProduction);
                  setProductionExpenses([{ ...emptyProductionExpense }]);
                  setEditingProductionId(null);
                  setIsProductionModalOpen(true);
                }}
                type="button"
              >
                +
              </button>
            }
            description="Search and manage production records."
            title="Production"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FilterField
                label="Date from"
                onChange={setProductionDateFrom}
                placeholder="MM/DD/YYYY"
                type="date"
                value={productionDateFrom}
              />
              <FilterField
                label="Date to"
                onChange={setProductionDateTo}
                placeholder="MM/DD/YYYY"
                type="date"
                value={productionDateTo}
              />
              <SelectField
                label="Company"
                onChange={setProductionCompanyFilter}
                options={companies.map((company) => ({
                  label: company.name,
                  value: String(company.id),
                }))}
                placeholder="All companies"
                required={false}
                value={productionCompanyFilter}
              />
              <FilterField
                label="Group"
                onChange={setProductionGroupFilter}
                value={productionGroupFilter}
              />
            </div>

            <div className="mt-6 grid gap-3">
              {filteredProductionRecords.length === 0 ? (
                <EmptyState message="No production records found." />
              ) : (
                filteredProductionRecords.map((record) => {
                  const totals = calculateProduction(record);

                  return (
                    <RecordCard
                      key={record.id}
                      onDelete={() => deleteProduction(record.id)}
                      onDetail={() => setProductionDetail(record)}
                      onEdit={() => editProduction(record)}
                      title={`Production #${record.number}`}
                    >
                      Group: {record.group} | FT: {record.ft} | Date:{" "}
                      {formatDate(record.date)}
                      <br />
                      Company: {getCompanyName(record.companyId)} | Customer:{" "}
                      {getCustomerName(record.customerId)}
                      <br />
                      Total Value: {formatMoney(totals.totalValue)} | Net Value:{" "}
                      {formatMoney(totals.netValue)}
                    </RecordCard>
                  );
                })
              )}
            </div>
          </RegistryPanel>

          {isProductionModalOpen ? (
            <Modal
              onClose={() => setIsProductionModalOpen(false)}
              title={
                editingProductionId
                  ? "Edit Production"
                  : `New Production #${getNextProductionNumber()}`
              }
            >
              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveProduction}>
                <ReadOnlyField
                  label="Number"
                  value={
                    editingProductionId
                      ? String(
                          productionRecords.find(
                            (record) => record.id === editingProductionId,
                          )?.number ?? "",
                        )
                      : String(getNextProductionNumber())
                  }
                />
                <TextField
                  label="Group"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, group: value }))
                  }
                  value={productionForm.group}
                />
                <TextField
                  label="FT"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, ft: value }))
                  }
                  value={productionForm.ft}
                />
                <TextField
                  label="Date"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, date: value }))
                  }
                  placeholder="MM/DD/YYYY"
                  value={productionForm.date}
                />
                <SelectField
                  label="Company"
                  onChange={(value) =>
                    setProductionForm((current) => ({
                      ...current,
                      companyId: value,
                    }))
                  }
                  options={companies.map((company) => ({
                    label: company.name,
                    value: String(company.id),
                  }))}
                  placeholder="Select a company"
                  value={productionForm.companyId}
                />
                <SelectField
                  label="Customer"
                  onChange={(value) =>
                    setProductionForm((current) => ({
                      ...current,
                      customerId: value,
                    }))
                  }
                  options={customers.map((customer) => ({
                    label: customer.name,
                    value: String(customer.id),
                  }))}
                  placeholder="Select a customer"
                  value={productionForm.customerId}
                />
                <TextField
                  label="HH 17x30"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, hh17x30: value }))
                  }
                  type="number"
                  value={productionForm.hh17x30}
                />
                <TextField
                  label="HH 24 x 36"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, hh24x36: value }))
                  }
                  type="number"
                  value={productionForm.hh24x36}
                />
                <MoneyField
                  label="Cost FT"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, costFt: value }))
                  }
                  value={productionForm.costFt}
                />
                <MoneyField
                  label="Value FT"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, valueFt: value }))
                  }
                  value={productionForm.valueFt}
                />
                <MoneyField
                  label="Cost HH"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, costHh: value }))
                  }
                  value={productionForm.costHh}
                />
                <MoneyField
                  label="Value HH"
                  onChange={(value) =>
                    setProductionForm((current) => ({ ...current, valueHh: value }))
                  }
                  value={productionForm.valueHh}
                />

                <div className="md:col-span-2">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold">Expenses</h3>
                  </div>

                  <div className="grid gap-3">
                    {productionExpenses.map((expense, index) => (
                      <div
                        className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_auto]"
                        key={index}
                      >
                        <SelectField
                          label="Expense Type"
                          onChange={(value) =>
                            updateProductionExpense(
                              index,
                              "expenseTypeId",
                              value,
                            )
                          }
                          options={expenseTypes.map((expenseType) => ({
                            label: expenseType.name,
                            value: String(expenseType.id),
                          }))}
                          placeholder="Select an expense type"
                          value={expense.expenseTypeId}
                        />
                        <MoneyField
                          label="Expense Value"
                          onChange={(value) =>
                            updateProductionExpense(index, "value", value)
                          }
                          value={expense.value}
                        />
                        <div className="flex items-end">
                          <button
                            aria-label="Add expense"
                            className="mr-2 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                            onClick={addProductionExpense}
                            type="button"
                          >
                            +
                          </button>
                          <button
                            className="h-11 rounded-xl bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                            onClick={() => removeProductionExpense(index)}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <FormActions isEditing={Boolean(editingProductionId)} />
              </form>
            </Modal>
          ) : null}

          {productionDetail ? (
            <Modal
              onClose={() => setProductionDetail(null)}
              title={`Production #${productionDetail.number}`}
            >
              {(() => {
                const totals = calculateProduction(productionDetail);

                return (
                  <div className="space-y-6">
                    <div className="grid gap-3 md:grid-cols-2">
                      <DetailItem label="Group" value={productionDetail.group} />
                      <DetailItem label="FT" value={productionDetail.ft} />
                      <DetailItem
                        label="Date"
                        value={formatDate(productionDetail.date)}
                      />
                      <DetailItem
                        label="Company"
                        value={getCompanyName(productionDetail.companyId)}
                      />
                      <DetailItem
                        label="Customer"
                        value={getCustomerName(productionDetail.customerId)}
                      />
                      <DetailItem
                        label="HH Quantity"
                        value={String(totals.hhQuantity)}
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <DetailItem
                        label="FT Value"
                        value={formatMoney(totals.ftValue)}
                      />
                      <DetailItem
                        label="FT Cost"
                        value={formatMoney(totals.ftCost)}
                      />
                      <DetailItem
                        label="HH Value"
                        value={formatMoney(totals.hhValue)}
                      />
                      <DetailItem
                        label="HH Cost"
                        value={formatMoney(totals.hhCost)}
                      />
                      <DetailItem
                        label="Expense Total"
                        value={formatMoney(totals.expenseTotal)}
                      />
                      <DetailItem
                        label="Total Cost"
                        value={formatMoney(totals.totalCost)}
                      />
                    </div>

                    <div className="grid gap-3 rounded-2xl bg-slate-950 p-4 text-white md:grid-cols-2">
                      <DetailItem
                        label="Total Value"
                        tone="dark"
                        value={formatMoney(totals.totalValue)}
                      />
                      <DetailItem
                        label="Net Value"
                        tone="dark"
                        value={formatMoney(totals.netValue)}
                      />
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-bold">Expenses</h3>
                      <div className="grid gap-2">
                        {productionDetail.expenses.length === 0 ? (
                          <EmptyState message="No expenses added." />
                        ) : (
                          productionDetail.expenses.map((expense, index) => (
                            <div
                              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
                              key={`${expense.expenseTypeId}-${index}`}
                            >
                              <span>
                                {getExpenseTypeName(expense.expenseTypeId)}
                              </span>
                              <span className="font-bold">
                                {formatMoney(toNumber(expense.value))}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Modal>
          ) : null}
        </>
      );
    }

    if (activeSection === "Inventory") {
      const normalizedInventoryFilter = inventoryFilter.toLowerCase();
      const filteredInventoryItems = inventoryItems.filter((item) =>
        [String(item.id), item.description, item.vn, item.value, item.plate]
          .join(" ")
          .toLowerCase()
          .includes(normalizedInventoryFilter),
      );

      return (
        <>
          <RegistryPanel
            action={
              <button
                aria-label="New inventory item"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                onClick={() => {
                  setInventoryForm(emptyInventoryItem);
                  setEditingInventoryId(null);
                  setIsInventoryModalOpen(true);
                }}
                type="button"
              >
                +
              </button>
            }
            description="Search and manage inventory records."
            title="Inventory"
          >
            <FilterField
              label="Search inventory"
              onChange={setInventoryFilter}
              value={inventoryFilter}
            />

            <div className="mt-6 grid gap-3">
              {filteredInventoryItems.length === 0 ? (
                <EmptyState message="No inventory items found." />
              ) : (
                filteredInventoryItems.map((item) => (
                  <RecordCard
                    key={item.id}
                    onDelete={() => deleteInventoryItem(item.id)}
                    onEdit={() => editInventoryItem(item)}
                    onPhotoClick={setImagePreview}
                    photos={item.photos}
                    title={`Inventory #${item.id}`}
                  >
                    Description: {item.description}
                    <br />
                    VN: {item.vn} | Plate: {item.plate}
                    <br />
                    Value: {formatMoney(toNumber(item.value))}
                  </RecordCard>
                ))
              )}
            </div>
          </RegistryPanel>

          {isInventoryModalOpen ? (
            <Modal
              onClose={() => setIsInventoryModalOpen(false)}
              title={
                editingInventoryId
                  ? "Edit Inventory"
                  : `New Inventory #${getNextInventoryId()}`
              }
            >
              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveInventoryItem}>
                <ReadOnlyField
                  label="ID"
                  value={
                    editingInventoryId
                      ? String(editingInventoryId)
                      : String(getNextInventoryId())
                  }
                />
                <TextField
                  label="Description"
                  onChange={(value) =>
                    setInventoryForm((current) => ({
                      ...current,
                      description: value,
                    }))
                  }
                  value={inventoryForm.description}
                />
                <TextField
                  label="VN"
                  onChange={(value) =>
                    setInventoryForm((current) => ({ ...current, vn: value }))
                  }
                  value={inventoryForm.vn}
                />
                <MoneyField
                  label="Value"
                  onChange={(value) =>
                    setInventoryForm((current) => ({ ...current, value }))
                  }
                  value={inventoryForm.value}
                />
                <TextField
                  label="Plate"
                  onChange={(value) =>
                    setInventoryForm((current) => ({ ...current, plate: value }))
                  }
                  value={inventoryForm.plate}
                />
                <div className="md:col-span-2">
                  <PhotoField
                    label="Asset Photo"
                    onChange={(value) =>
                      setInventoryForm((current) => ({
                        ...current,
                          photos: value,
                      }))
                    }
                    value={inventoryForm.photos}
                  />
                </div>
                <FormActions isEditing={Boolean(editingInventoryId)} />
              </form>
            </Modal>
          ) : null}
        </>
      );
    }

    if (activeSection === "Expense Types") {
      const normalizedExpenseTypeFilter = expenseTypeFilter.toLowerCase();
      const filteredExpenseTypes = expenseTypes.filter((expenseType) =>
        expenseType.name.toLowerCase().includes(normalizedExpenseTypeFilter),
      );

      return (
        <>
          <RegistryPanel
            action={
              <button
                aria-label="New expense type"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                onClick={() => {
                  setExpenseTypeForm(emptyExpenseType);
                  setEditingExpenseTypeId(null);
                  setIsExpenseTypeModalOpen(true);
                }}
                type="button"
              >
                +
              </button>
            }
            description="Search and manage expense types for production records."
            title="Expense Types"
          >
            <FilterField
              label="Search expense types"
              onChange={setExpenseTypeFilter}
              value={expenseTypeFilter}
            />

            <div className="mt-6 grid gap-3">
              {filteredExpenseTypes.length === 0 ? (
                <EmptyState message="No expense types found." />
              ) : (
                filteredExpenseTypes.map((expenseType) => (
                  <RecordCard
                    key={expenseType.id}
                    onDelete={() => deleteExpenseType(expenseType.id)}
                    onEdit={() => editExpenseType(expenseType)}
                    title={expenseType.name}
                  >
                    Available for production expense entries.
                  </RecordCard>
                ))
              )}
            </div>
          </RegistryPanel>

          {isExpenseTypeModalOpen ? (
            <Modal
              onClose={() => setIsExpenseTypeModalOpen(false)}
              title={
                editingExpenseTypeId
                  ? "Edit Expense Type"
                  : "New Expense Type"
              }
            >
              <form className="grid gap-4" onSubmit={saveExpenseType}>
                <TextField
                  label="Name"
                  onChange={(value) =>
                    setExpenseTypeForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                  value={expenseTypeForm.name}
                />
                <FormActions isEditing={Boolean(editingExpenseTypeId)} />
              </form>
            </Modal>
          ) : null}
        </>
      );
    }

    if (activeSection === "Companies") {
      const normalizedCompanyFilter = companyFilter.toLowerCase();
      const filteredCompanies = companies.filter((company) =>
        [company.name, company.street, company.number, company.city, company.state]
          .join(" ")
          .toLowerCase()
          .includes(normalizedCompanyFilter),
      );

      return (
        <>
          <RegistryPanel
            action={
              <button
                aria-label="New company"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                onClick={() => {
                  setCompanyForm(emptyCompany);
                  setEditingCompanyId(null);
                  setIsCompanyModalOpen(true);
                }}
                type="button"
              >
                +
              </button>
            }
            description="Search and manage company records."
            title="Companies"
          >
            <FilterField
              label="Search companies"
              onChange={setCompanyFilter}
              value={companyFilter}
            />

            <div className="mt-6 grid gap-3">
              {filteredCompanies.length === 0 ? (
                <EmptyState message="No companies found." />
              ) : (
                filteredCompanies.map((company) => (
                  <RecordCard
                    key={company.id}
                    onDelete={() => deleteCompany(company.id)}
                    onEdit={() => editCompany(company)}
                    title={company.name}
                  >
                    {company.street}, {company.number}
                    <br />
                    {company.city}, {company.state}
                  </RecordCard>
                ))
              )}
            </div>
          </RegistryPanel>

          {isCompanyModalOpen ? (
            <Modal
              onClose={() => setIsCompanyModalOpen(false)}
              title={editingCompanyId ? "Edit Company" : "New Company"}
            >
              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveCompany}>
                <TextField
                  label="Name"
                  onChange={(value) =>
                    setCompanyForm((current) => ({ ...current, name: value }))
                  }
                  value={companyForm.name}
                />
                <TextField
                  label="Street"
                  onChange={(value) =>
                    setCompanyForm((current) => ({ ...current, street: value }))
                  }
                  value={companyForm.street}
                />
                <TextField
                  label="Number"
                  onChange={(value) =>
                    setCompanyForm((current) => ({ ...current, number: value }))
                  }
                  value={companyForm.number}
                />
                <TextField
                  label="City"
                  onChange={(value) =>
                    setCompanyForm((current) => ({ ...current, city: value }))
                  }
                  value={companyForm.city}
                />
                <TextField
                  label="State"
                  onChange={(value) =>
                    setCompanyForm((current) => ({ ...current, state: value }))
                  }
                  value={companyForm.state}
                />
                <FormActions isEditing={Boolean(editingCompanyId)} />
              </form>
            </Modal>
          ) : null}
        </>
      );
    }

    if (activeSection === "Customers") {
      const normalizedCustomerFilter = customerFilter.toLowerCase();
      const filteredCustomers = customers.filter((customer) =>
        [customer.name, customer.phone, customer.city, customer.state]
          .join(" ")
          .toLowerCase()
          .includes(normalizedCustomerFilter),
      );

      return (
        <>
          <RegistryPanel
            action={
              <button
                aria-label="New customer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                onClick={() => {
                  setCustomerForm(emptyCustomer);
                  setEditingCustomerId(null);
                  setIsCustomerModalOpen(true);
                }}
                type="button"
              >
                +
              </button>
            }
            description="Search and manage customer records."
            title="Customers"
          >
            <FilterField
              label="Search customers"
              onChange={setCustomerFilter}
              value={customerFilter}
            />

            <div className="mt-6 grid gap-3">
              {filteredCustomers.length === 0 ? (
                <EmptyState message="No customers found." />
              ) : (
                filteredCustomers.map((customer) => (
                  <RecordCard
                    key={customer.id}
                    onDelete={() => deleteCustomer(customer.id)}
                    onEdit={() => editCustomer(customer)}
                    title={customer.name}
                  >
                    {customer.phone}
                    <br />
                    {customer.city}, {customer.state}
                  </RecordCard>
                ))
              )}
            </div>
          </RegistryPanel>

          {isCustomerModalOpen ? (
            <Modal
              onClose={() => setIsCustomerModalOpen(false)}
              title={editingCustomerId ? "Edit Customer" : "New Customer"}
            >
              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveCustomer}>
                <TextField
                  label="Name"
                  onChange={(value) =>
                    setCustomerForm((current) => ({ ...current, name: value }))
                  }
                  value={customerForm.name}
                />
                <TextField
                  label="Phone"
                  onChange={(value) =>
                    setCustomerForm((current) => ({ ...current, phone: value }))
                  }
                  value={customerForm.phone}
                />
                <TextField
                  label="City"
                  onChange={(value) =>
                    setCustomerForm((current) => ({ ...current, city: value }))
                  }
                  value={customerForm.city}
                />
                <TextField
                  label="State"
                  onChange={(value) =>
                    setCustomerForm((current) => ({ ...current, state: value }))
                  }
                  value={customerForm.state}
                />
                <FormActions isEditing={Boolean(editingCustomerId)} />
              </form>
            </Modal>
          ) : null}
        </>
      );
    }

    if (activeSection === "Employees") {
      const normalizedEmployeeFilter = employeeFilter.toLowerCase();
      const filteredEmployees = employees.filter((employee) =>
        [employee.name, employee.phone]
          .join(" ")
          .toLowerCase()
          .includes(normalizedEmployeeFilter),
      );

      return (
        <>
          <RegistryPanel
            action={
              <button
                aria-label="New employee"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                onClick={() => {
                  setEmployeeForm(emptyEmployee);
                  setEditingEmployeeId(null);
                  setIsEmployeeModalOpen(true);
                }}
                type="button"
              >
                +
              </button>
            }
            description="Search and manage employee records."
            title="Employees"
          >
            <FilterField
              label="Search employees"
              onChange={setEmployeeFilter}
              value={employeeFilter}
            />

            <div className="mt-6 grid gap-3">
              {filteredEmployees.length === 0 ? (
                <EmptyState message="No employees found." />
              ) : (
                filteredEmployees.map((employee) => (
                  <RecordCard
                    key={employee.id}
                    onDelete={() => deleteEmployee(employee.id)}
                    onEdit={() => editEmployee(employee)}
                    title={employee.name}
                  >
                    {employee.phone}
                  </RecordCard>
                ))
              )}
            </div>
          </RegistryPanel>

          {isEmployeeModalOpen ? (
            <Modal
              onClose={() => setIsEmployeeModalOpen(false)}
              title={editingEmployeeId ? "Edit Employee" : "New Employee"}
            >
              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveEmployee}>
                <TextField
                  label="Name"
                  onChange={(value) =>
                    setEmployeeForm((current) => ({ ...current, name: value }))
                  }
                  value={employeeForm.name}
                />
                <TextField
                  label="Phone"
                  onChange={(value) =>
                    setEmployeeForm((current) => ({ ...current, phone: value }))
                  }
                  value={employeeForm.phone}
                />
                <FormActions isEditing={Boolean(editingEmployeeId)} />
              </form>
            </Modal>
          ) : null}
        </>
      );
    }

    if (activeSection === "Users") {
      const normalizedUserFilter = userFilter.toLowerCase();
      const filteredUsers = users.filter((user) =>
        [user.name, user.username]
          .join(" ")
          .toLowerCase()
          .includes(normalizedUserFilter),
      );

      return (
        <>
          <RegistryPanel
            action={
              <button
                aria-label="New user"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-2xl font-bold leading-none text-white transition hover:bg-slate-800"
                onClick={() => {
                  setUserForm(emptyUser);
                  setEditingUserId(null);
                  setIsUserModalOpen(true);
                }}
                type="button"
              >
                +
              </button>
            }
            description="Search and manage system users."
            title="Users"
          >
            <FilterField
              label="Search users"
              onChange={setUserFilter}
              value={userFilter}
            />

            <div className="mt-6 grid gap-3">
              {filteredUsers.length === 0 ? (
                <EmptyState message="No users found." />
              ) : (
                filteredUsers.map((user) => (
                  <RecordCard
                    key={user.id}
                    onDelete={() => deleteUser(user.id)}
                    onEdit={() => editUser(user)}
                    title={user.name}
                  >
                    Username: {user.username}
                  </RecordCard>
                ))
              )}
            </div>
          </RegistryPanel>

          {isUserModalOpen ? (
            <Modal
              onClose={() => setIsUserModalOpen(false)}
              title={editingUserId ? "Edit User" : "New User"}
            >
              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveUser}>
                <TextField
                  label="Name"
                  onChange={(value) =>
                    setUserForm((current) => ({ ...current, name: value }))
                  }
                  value={userForm.name}
                />
                <TextField
                  label="Username"
                  onChange={(value) =>
                    setUserForm((current) => ({ ...current, username: value }))
                  }
                  value={userForm.username}
                />
                <TextField
                  label="Password"
                  onChange={(value) =>
                    setUserForm((current) => ({ ...current, password: value }))
                  }
                  type="password"
                  value={userForm.password}
                />
                <FormActions isEditing={Boolean(editingUserId)} />
              </form>
            </Modal>
          ) : null}
        </>
      );
    }

    if (activeSection !== "Home") {
      return (
        <RegistryPanel
          description="This module is ready for the next implementation."
          title={activeSection}
        >
          <EmptyState message="No records available in this module yet." />
        </RegistryPanel>
      );
    }

    return (
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, Admin!</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
            Access system features through the cards below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight">Quick Access</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {menuItems.slice(1).map((item) => (
              <button
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
                key={item.label}
                onClick={() => handleSectionChange(item.label)}
                type="button"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-950">
                  {item.icon}
                </span>
                <span>
                  <span className="block text-lg font-bold">{item.label}</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {item.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-5 py-4 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                aria-expanded={isMenuOpen}
                aria-label="Open menu"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-950 transition hover:bg-slate-200 lg:hidden"
                onClick={() => setIsMenuOpen((current) => !current)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>
              <span className="h-5 w-5 rounded-full bg-slate-950" />
              <span className="text-xl font-bold tracking-tight sm:text-2xl">
                Sys Underground
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                A
              </span>
              <button
                aria-label="Open settings"
                className={`hidden h-11 w-11 items-center justify-center rounded-xl transition sm:flex ${
                  activeSection === "Settings"
                    ? "bg-slate-950 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => handleSectionChange("Settings")}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
                </svg>
              </button>
              <button
                className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
                onClick={() => {
                  setIsLoggedIn(false);
                  setActiveSection("Home");
                }}
                type="button"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-6xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[190px_1fr] lg:px-10">
          <aside
            className={`rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm lg:block ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeSection === item.label
                      ? "bg-slate-950 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  key={item.label}
                  onClick={() => handleSectionChange(item.label)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {renderActiveSection()}
        </section>

        {imagePreview ? (
          <ImagePreviewModal
            image={imagePreview}
            onClose={() => setImagePreview(null)}
          />
        ) : null}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-950">
      <section className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-10 flex items-center gap-4">
          <span className="h-5 w-5 rounded-full bg-slate-950" />
          <span className="text-3xl font-bold tracking-tight">
            Sys Underground
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Enter your username and password to continue.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
              id="username"
              name="username"
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
              placeholder="Enter your username"
              type="text"
              value={loginForm.username}
            />
          </div>

          <div>
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
              id="password"
              name="password"
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Enter your password"
              type="password"
              value={loginForm.password}
            />
          </div>

          {loginError ? (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {loginError}
            </p>
          ) : null}

          <button
            className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

function RegistryPanel({
  action,
  children,
  description,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "date" | "number" | "password" | "text";
  value: string;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={id}>
        {label}
      </label>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        step={type === "number" ? "0.01" : undefined}
        type={type}
        value={value}
      />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={id}>
        {label}
      </label>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
        id={id}
        readOnly
        type="text"
        value={value}
      />
    </div>
  );
}

function MoneyField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="mt-2 flex h-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
        <span className="flex w-11 items-center justify-center border-r border-slate-200 text-sm font-bold text-slate-500">
          $
        </span>
        <input
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-950 outline-none"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          required
          step="0.01"
          type="number"
          value={value}
        />
      </div>
    </div>
  );
}

function PhotoField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string[]) => void;
  value: string[];
}) {
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const images = await Promise.all(files.map(readImageFile));
    onChange([...value, ...images]);
  }

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={label}>
        {label}
      </label>
      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <input
          accept="image/*"
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
          id={label}
          multiple
          onChange={handleFileChange}
          type="file"
        />
        {value.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {value.map((image, index) => (
              <div className="relative" key={`${image}-${index}`}>
                <Image
                  alt={`Asset preview ${index + 1}`}
                  className="h-28 w-full rounded-xl object-cover"
                  height={112}
                  src={image}
                  unoptimized
                  width={220}
                />
                <button
                  aria-label="Remove image"
                  className="absolute right-2 top-2 rounded-lg bg-white px-2 py-1 text-xs font-bold text-rose-700 shadow"
                  onClick={() =>
                    onChange(value.filter((_, currentIndex) => currentIndex !== index))
                  }
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function readImageFile(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

function SelectField({
  label,
  onChange,
  options,
  placeholder,
  required = true,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder: string;
  required?: boolean;
  value: string;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={id}>
        {label}
      </label>
      <select
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterField({
  label,
  onChange,
  placeholder,
  type = "search",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "date" | "search";
  value: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={label}>
        {label}
      </label>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
        id={label}
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          placeholder ?? (type === "search" ? "Type to filter records" : undefined)
        }
        type={type}
        value={value}
      />
    </div>
  );
}

function FormActions({ isEditing }: { isEditing: boolean }) {
  return (
    <div className="flex items-end">
      <button
        className="h-11 w-full rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
        type="submit"
      >
        {isEditing ? "Save Changes" : "Add Record"}
      </button>
    </div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 py-8">
      <section className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-950 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <button
            aria-label="Close modal"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ImagePreviewModal({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-5 py-8">
      <section className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-4 flex justify-end">
          <button
            aria-label="Close image"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>
        <Image
          alt="Expanded asset"
          className="max-h-[75vh] w-full rounded-xl object-contain"
          height={720}
          src={image}
          unoptimized
          width={1100}
        />
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
      {message}
    </div>
  );
}

function RecordCard({
  children,
  onDelete,
  onDetail,
  onEdit,
  onPhotoClick,
  photos,
  title,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  onDetail?: () => void;
  onEdit: () => void;
  onPhotoClick?: (image: string) => void;
  photos?: string[];
  title: string;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        {photos && photos.length > 0 ? (
          <div className="flex max-w-44 flex-wrap gap-2">
            {photos.slice(0, 3).map((photo, index) => (
              <button
                aria-label={`Open ${title} image ${index + 1}`}
                key={`${photo}-${index}`}
                onClick={() => onPhotoClick?.(photo)}
                type="button"
              >
                <Image
                  alt={`${title} photo ${index + 1}`}
                  className="h-16 w-16 rounded-xl object-cover"
                  height={64}
                  src={photo}
                  unoptimized
                  width={64}
                />
              </button>
            ))}
            {photos.length > 3 ? (
              <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 text-sm font-bold text-slate-700">
                +{photos.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}
        <div>
          <h3 className="font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {onDetail ? (
          <button
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={onDetail}
            type="button"
          >
            Details
          </button>
        ) : null}
        <button
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          onClick={onEdit}
          type="button"
        >
          Edit
        </button>
        <button
          className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          onClick={onDelete}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function DetailItem({
  label,
  tone = "light",
  value,
}: {
  label: string;
  tone?: "dark" | "light";
  value: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        tone === "dark" ? "bg-white/10" : "bg-slate-50"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          tone === "dark" ? "text-slate-300" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-bold ${
          tone === "dark" ? "text-white" : "text-slate-950"
        }`}
      >
        {value || "Not informed"}
      </p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
    </article>
  );
}

function DashboardDetailRow({
  children,
  title,
  value,
}: {
  children: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 className="font-bold text-slate-950">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>
      </div>
      <p className="text-sm font-bold text-slate-950">{value}</p>
    </article>
  );
}
