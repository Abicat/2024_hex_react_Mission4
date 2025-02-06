import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const { VITE_BASE_URL: BASE_URL } = import.meta.env;

function LoginPage({ setIsAuth }) {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;
      setIsAuth(true);
    } catch (error) {
      alert(`登入失敗`);
    }
  };

  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      console.error(error);
    }
  };

  // 直接從 cookie 取得 token 驗證登入
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    checkUserLogin();
  }, []);

  const handleAccountInputChange = (e) => {
    const { value, name } = e.target;

    setAccount({
      ...account,
      [name]: value,
    });
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div style={{ width: "100%", maxWidth: "300px" }}>
          <h1 className="mb-5 text-center">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                id="username"
                name="username"
                value={account.username}
                onChange={handleAccountInputChange}
                type="email"
                className="form-control"
                placeholder="name@example.com"
                required
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                name="password"
                value={account.password}
                onChange={handleAccountInputChange}
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-3 mb-3 text-muted text-center">
            &copy; 2024~∞ - 六角學院
          </p>
        </div>
      </div>
    </>
  );
}

LoginPage.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
};

export default LoginPage;
