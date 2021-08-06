import { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

export default function App() {
  const [gitHubUsers, setGitHubUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const getGitHubUserData = async (url, setState) => {
    try {
      const fetched = await fetch(url);
      setState(await fetched.json());
    } catch (err) {
      console.log("err", err);
    }
  };
  console.log("gitHubUsers", gitHubUsers);
  const hasUsers = gitHubUsers && gitHubUsers.items;
  return (
    <div className="App container">
      <div className="row my-3">
        <div className="col">
          <h1>Search Users</h1>
          <input
            type="text"
            style={{ minWidth: "300px" }}
            className="mb-2"
            onChange={async (e) => {
              // await getGitHubUserData(
              //   `https://api.github.com/search/users?q=${e.target.value}&per_page=10&page=1`,
              //   setGitHubUsers
              // )
              await getGitHubUserData(`users.json`, setGitHubUsers);
            }}
            placeholder={"Seach by name, email, or username"}
          />
          {!gitHubUsers && (
            <h5 className="">Let us help you find your next employee :)</h5>
          )}
          {gitHubUsers && gitHubUsers.total_count > 0 && (
            <p className="text-muted mt-1">
              {gitHubUsers.items.length} users of {gitHubUsers.total_count}
            </p>
          )}

          {gitHubUsers && gitHubUsers.total_count === 0 && (
            <p className="text-muted mt-1">
              Sorry, there are no matching users with the provided criteria.
              Please try again with a different keyword.
            </p>
          )}
        </div>
      </div>
      <div className="row">
        {hasUsers &&
          gitHubUsers.items.map((user, index) => {
            return (
              <div
                key={user.id}
                className="col-auto col-lg-4 mb-4"
                /*style={{ width: "18rem" }}*/
              >
                <div className="card p-3">
                  <img className="w-100 h-100" src={user.avatar_url} />
                  <div className="card-body">
                    <h5 className="card-title">{user.login}</h5>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <a
                        className="text-decoration-none"
                        target="__blank"
                        href={user.html_url}
                      >
                        Profile
                      </a>
                    </li>
                    <li className="list-group-item">
                      <a
                        target="__blank"
                        href={`${user.html_url}?tab=repositories`}
                        className="text-decoration-none"
                      >
                        Repositories
                      </a>
                    </li>
                  </ul>
                  <div className="card-body">
                    <button
                      className="btn btn-primary"
                      onClick={async (e) => {
                        setOpen(true);
                        // await getGitHubUserData(
                        //   `https://api.github.com/users/${user.login}`,
                        //   setSelectedUser
                        // );
                        await getGitHubUserData(`user.json`, setSelectedUser);
                      }}
                    >
                      More info
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <Modal
        showCloseIcon={false}
        open={open}
        onClose={() => setOpen(false)}
        center
      >
        {selectedUser && (
          <>
            <div className={`modal-header position-relative p-0`}>
              <h5 className="modal-title w-100 font-weight-bold">User Data</h5>

              <button
                tabIndex={-1}
                className="btn close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setOpen(false)}
                style={{ padding: "0.8rem" }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="my-3">
              <ul className="list-unstyled">
                <ul className="list-group">
                  <li className="list-group-item">
                    Name: {selectedUser.name || "N/A"}
                  </li>
                  <li className="list-group-item">
                    Location: {selectedUser.location || "N/A"}
                  </li>
                  <li className="list-group-item">
                    Email: {selectedUser.email || "N/A"}
                  </li>
                  <li className="list-group-item">
                    Public Repos: {selectedUser.public_repos || "N/A"}
                  </li>
                  <li className="list-group-item">
                    Account Creation: {selectedUser.created_at || "N/A"}
                  </li>
                  <li className="list-group-item">
                    Last Updated: {selectedUser.updated_at || "N/A"}
                  </li>
                </ul>
              </ul>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
