import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cid, setCid] = useState(null);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      Array.from(selectedFile).forEach((file) => {
        formData.append("file", file);
      });
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setCid(resData.Ipfshash)
      console.log(formData);
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className="form-container">
      <label htmlFor="ipfsFile" className="form-label">Choose File : </label>
      <input
        type="file"
        onChange={changeHandler}
        multiple
        id="ipfsFile"
        accept=".jpg, .jpeg, .png, .gif"
      />
      <button onClick={handleSubmission}>Submit</button>
      {cid && (
        <img
          src={`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`}
          alt="ipfs image"
        />
      )}
    </div>
    </>
  );
}

export default App;
