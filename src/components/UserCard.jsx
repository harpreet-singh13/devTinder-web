const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, about, age, gender } = user;
  return (
    <div>
      <div className="card bg-base-200 w-96 shadow-sm">
        <figure>
          <img
            // src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            src={photoUrl}
            alt="photo"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p>{age + ", " + gender}</p>}
          <p>{about}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-primary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
