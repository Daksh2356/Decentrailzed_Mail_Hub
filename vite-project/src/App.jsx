import { useEffect, useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cid, setCid] = useState(null);

  useEffect(() => {
    setCid(null); // Initialize cid state to null when component mounts
    setSelectedFile(null); // Initialize selectedFile state to null when component mounts

  }, []);


  const changeHandler = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      Array.from(selectedFile).forEach((file) => {
        formData.append("file", file);
        // including nname of file in metadata
        formData.append("pinataMetadata", JSON.stringify({ name: file.name }));
      });

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
      setCid(resData.IpfsHash);
      console.log(resData.IpfsHash);
      console.log(formData);
      console.log("response: ", resData);
      console.log(`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-16 items-center justify-center h-screen text-2xl">
        <h1 className="pt-5 text-3xl">
          Multiple Usecases of Decentralized Storage Protocols
        </h1>
        <div className="p-3 border-2 border-blue-700 rounded-lg ">
          <label htmlFor="ipfsFile" className="form-label">
            Choose File :{" "}
          </label>
          <input
            type="file"
            onChange={changeHandler}
            multiple
            id="ipfsFile"
            accept=".jpg, .jpeg, .png, .gif"
          />
          <button
            className="border border-solid py-3 px-2.5 rounded w-32 text-base font-medium bg-gray-500 border-transparent cursor-pointer transition text-xl"
            onClick={handleSubmission}
          >
            Submit
          </button>
        </div>

        {cid!==null && (
          <div className="p-3 border-2 border-red-700 rounded-lg text-base">
            <img
              src={`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`}
              alt="ipfs image"
              className="max-h-80 w-auto"
            />
            <div className="p-1 text-center">Your IPFS hash: {cid} </div>
            <div className="p-1 text-center">
              {" "}
              <a href={`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`}>Click here to see the uploaded image!!</a>{" "}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
