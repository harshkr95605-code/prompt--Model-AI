import { useCallback, useState } from "react";
import "./App.css";
import { generateContent, purifyCode } from "./helper";
import React from "react";

// console.log(import.meta.env.VITE_GOOGLE_API_KEY);

const App = () => {
	const [info, setInfo] = useState({
		userQuery: "",
		error: "",
		generatedComponent: null,
		loading: false,
	});

	const handleChange = useCallback((e) => {
		setInfo((prev) => ({ ...prev, userQuery: e.target.value, error: "" }));
	}, []);

	const handleGenerate = useCallback(async () => {
		if (info?.loading) return;

		if (!info?.userQuery?.length) {
			return setInfo((prev) => ({
				...prev,
				error: "Please enter a valid query",
			}));
		}

		setInfo((prev) => ({ ...prev, loading: true, error: "" ,generatedComponent:""}));
		//api call
    try{
      			const response = await generateContent(info?.userQuery);
			let componentCode = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      componentCode = purifyCode(componentCode);
    let Component = new Function(
      "React",
      `try{
      ${componentCode}
      return GeneratedComponent
    }catch(error){
    throw(error)
    }`

    )(React);
			setInfo((prev) => ({
				...prev,
				generatedComponent: <Component/>,
        error:"",
        userQuery:"",
			}));
			console.log("Response: ", componentCode);
		} catch (error) {
			console.log("Error: ", error);
			setInfo((prev) => ({
				...prev,
				error: error?.message || "Something went wrong, please try again",
			}));
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [info?.userQuery, info?.loading]);

	return (
		<div className="codeGeneratorParentContainer">
			<div className="inputSectionContainer">
				<textarea
					className="textAreaInput"
					placeholder="Describe your react component ..."
					value={info.userQuery}
					onChange={handleChange}
				/>
				<button className="generateButton" onClick={handleGenerate}>
					Generate
				</button>
			</div>
			<div className="previewSectionContainer">
				{info?.error && <div className="error-message">{info?.error}</div>}
				{info?.generatedComponent ? (
					info?.generatedComponent
				) : (
					<div className="emptyMessage">
						{info?.loading ? (
							<div className="loading-container">
								<div className="loading-spinner"></div>
								<span>Genrate Component</span>
							</div>
						) : (
							<p>
								Describe your component in the input field and click Generate.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
