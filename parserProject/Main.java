import java.io.FileReader;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.*;

public class Main {

	static String defaultShader = "texDiffNormalMapProg";
	static String texturesDirectory = "texture";
	static String outputFile = "result.xml";
	static String fileName = "input.fbx";

	/*
	static String defaultShader = "texDiffNormalMapProg";
	static String texturesDirectory = "D:\\sauvegarde\\Mes Documents\\Cours\\ESIR\\A2\\SI\\Projet\\SI_TP2\\models\\Western_Saloon";
	static String outputFile = "D:\\sauvegarde\\Mes Documents\\Cours\\ESIR\\A2\\SI\\Projet\\SI_TP2\\parserProject\\resultsaloon.xml";
	static String fileName = "D:\\sauvegarde\\Mes Documents\\Cours\\ESIR\\A2\\SI\\Projet\\SI_TP2\\models\\Western_Saloon\\saloon2.fbx";
	*/
	public static void main(String args[]) {

		// The name of the file to open.
		if (args.length == 0) {
			System.out.println("Using default values for directories and default shader.");
			System.out.println("Textures directory : " + texturesDirectory);
			System.out.println("Output file : " + outputFile);
			System.out.println("File name : " + fileName);
		} else {
			try {
				fileName = args[0];
				outputFile = args[1];
				texturesDirectory = args[2];
				defaultShader = args[3];
			} catch (Exception e) {
				System.out.println("Not enough arguments.");
				System.out.println("use : Main <fileName> <output> <texturesDirectory> <defaultShader>");
				return;
			}
		}

		// This will reference one line at a time
		String line = null;

		try {
			// FileReader reads text files in the default encoding.
			FileReader fileReader = new FileReader(fileName);

			// Always wrap FileReader in BufferedReader.
			BufferedReader bufferedReader = new BufferedReader(fileReader);
			StringBuilder all = new StringBuilder();
			while ((line = bufferedReader.readLine()) != null) {
				all.append(line).append('\n');
			}
			checkText(all);
			// Always close files.
			bufferedReader.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void checkText(StringBuilder all) {
		// TODO LIGHTS
		Pattern pattMesh = Pattern.compile("Model: [0-9]*, \"Model::[^,]*, \"(Mesh)\" \\{([^}]*)\\}");
		Pattern pattLights = Pattern.compile("Model: [0-9]*, \"Model::[^,]*, \"(Light)\" \\{([^}]*)\\}");
		Matcher m = pattMesh.matcher(all);
		Matcher mLight = pattLights.matcher(all);
		ArrayList<String> res = new ArrayList<String>();
		while (m.find()) {
			res.add(m.group(0));
		}
		while(mLight.find()) {
			searchLight(mLight.group(0),all);
		}
		fillList(res);
	}
	
	static ArrayList<String> lights = new ArrayList<String>();
	
	public static void searchLight(String line, StringBuilder all) {
		Pattern pLightName = Pattern.compile("Model::([^,\"]*)");
		Pattern pTrans = Pattern.compile("P: \"Lcl Translation\".*");
		Matcher mLight = pLightName.matcher(line);
		String lightName = "";
		String[] resValuesT = { "0", "0", "0" };
		String[] color = { "0", "0", "0" };
		String intensity = "1";
		while (mLight.find()) {
			lightName = mLight.group(1);
			Matcher mTrans = pTrans.matcher(line);
			while (mTrans.find()) {
				String[] resS = mTrans.group(0).split(",");
				resValuesT[0] = resS[resS.length - 3];
				resValuesT[1] = resS[resS.length - 2];
				resValuesT[2] = resS[resS.length - 1];
			}
		}
		Pattern pLightNode = Pattern.compile(";NodeAttribute::, Model::"+lightName+"([^;]*)");
		Matcher mLightNode = pLightNode.matcher(all);
		while(mLightNode.find()) {
			String nodeAttributeBlock = mLightNode.group(1);
			String nodeAttributeId = nodeAttributeBlock.split(",")[1];
			Pattern pLightAttribute = Pattern.compile("NodeAttribute: "+nodeAttributeId+", \"NodeAttribute::\", \"Light\" \\{([^}]*)\\}");
			Matcher mLightAttribute = pLightAttribute.matcher(all);
			while(mLightAttribute.find()) {
				String lightAttributeGroup = mLightAttribute.group(1);
				Pattern pColor = Pattern.compile("P: \"Color\".*");
				Matcher mColor = pColor.matcher(lightAttributeGroup);
				
				while(mColor.find()) {
					String[] resS = mColor.group(0).split(",");
					color[0] = resS[resS.length - 3];
					color[1] = resS[resS.length - 2];
					color[2] = resS[resS.length - 1];
				}
				Pattern pIntensity = Pattern.compile("P: \"Intensity\".*");
				Matcher mIntensity = pIntensity.matcher(lightAttributeGroup);
				while(mIntensity.find()) {
					String[] resS = mIntensity.group(0).split(",");
					intensity = resS[resS.length-1];
				}
			}
		}
		color[0] = Float.toString(Float.parseFloat(color[0])*Float.parseFloat(intensity));
		color[1] = Float.toString(Float.parseFloat(color[1])*Float.parseFloat(intensity));
		color[2] = Float.toString(Float.parseFloat(color[2])*Float.parseFloat(intensity));
		String res = "<LIGHT id=\""+lightName+"\" position=\""+resValuesT[0]+","+resValuesT[1]+","+resValuesT[2]+
		"\" color=\""+color[0]+","+color[1]+","+color[2]+"\">"+lightName+"</LIGHT>";
		lights.add(res);
	}

	public static ArrayList<String> getTexturesNames() {
		ArrayList<String> res = new ArrayList<String>();
		File folder = new File(texturesDirectory);
		File[] listOfFiles = folder.listFiles();

		for (int i = 0; i < listOfFiles.length; i++) {
			if (listOfFiles[i].isFile()) {
				res.add(listOfFiles[i].getName());
			}
		}
		return res;
	}

	public static void fillList(ArrayList<String> line) {
		StringBuilder finalS = new StringBuilder();
		StringBuilder addTab = new StringBuilder();
		// HEADER
		finalS.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");

		// SCENE
		finalS.append("\n" + addTab + "<SCENE>");
		addTab.append("\t");

		// SHADERS
		finalS.append("\n").append(addTab).append("<SHADERS>");
		addTab.append("\t");
		finalS.append("\n").append(addTab)
				.append("<XMATSHADER file=\"shaders/texProg.xml\" nbtex=\"1\" nblight=\"0\">textProg</XMATSHADER>")
				.append("\n").append(addTab)
				.append("<XMATSHADER file=\"shaders/texDiffProg.xml\" nbtex=\"1\" nblight=\"1\">texDiffProg</XMATSHADER>")
				.append("\n").append(addTab)
				.append("<XMATSHADER file=\"shaders/texNormalMapProg.xml\" nbtex=\"2\" nblight=\"1\">texDiffNormalMapProg</XMATSHADER>")
				.append("\n").append(addTab)
				.append("<XMATSHADER file=\"shaders/texPhongProg.xml\" nbtex=\"2\" nblight=\"1\">texPhongProg</XMATSHADER>")
				.append("\n").append(addTab)
				.append("<XMATSHADER file=\"shaders/shaderToon.xml\" nbtex=\"1\" nblight=\"1\">cartoon</XMATSHADER>")
				.append("\n").append(addTab)
				.append("<XMATSHADER file=\"shaders/shaderBaWMovie.xml\" nbtex=\"1\" nblight=\"1\">blackAndWhiteMovie</XMATSHADER>")
				.append("\n").append(addTab)
				.append("<XMATSHADER file=\"shaders/shaderBaW.xml\" nbtex=\"1\" nblight=\"1\">blackAndWhite</XMATSHADER>");
		addTab.deleteCharAt(addTab.length() - 1);
		finalS.append("\n").append(addTab).append("</SHADERS>");

		// LIGHTS
		// TODO : CHECK FBX TO SEE HOW LIGHTS ARE HANDLED
		finalS.append("\n").append(addTab).append("<LIGHTS>");
		addTab.append("\t");
		for(int i = 0; i < lights.size(); i++) {
			finalS.append("\n").append(addTab)
				.append(lights.get(i));
		/*
				.append("<LIGHT id=\"sun\" position=\"1000.0,500.0,500.0\" color=\"1.0,0.8,0.8\">light1</LIGHT>");
				*/
		}
		addTab.deleteCharAt(addTab.length() - 1);
		finalS.append("\n").append(addTab).append("</LIGHTS>");

		// TEXTURES
		finalS.append("\n").append(addTab).append("<TEXTURES>");
		addTab.append("\t");
		ArrayList<String> textures = getTexturesNames();
		for (String nameT : textures) {
			String type = "color";
			String idT = nameT.substring(0, nameT.length() - 4);
			if (nameT.contains("normal")) {
				type = "normal";
			}
			finalS.append("\n").append(addTab).append("<TEXTURE id=\"").append(idT).append("\" type=\"").append(type)
					.append("\">texture/").append(nameT).append("</TEXTURE>");
		}
		addTab.deleteCharAt(addTab.length() - 1);
		finalS.append("\n").append(addTab).append("</TEXTURES>");

		// SHAPES
		String modelName = "";
		finalS.append("\n").append(addTab).append("<SHAPES>");
		addTab.append("\t");
		Pattern pmodelName = Pattern.compile("Model::([^,\"]*)");
		for (int i = 0; i < line.size(); i++) {
			Matcher mModel = pmodelName.matcher(line.get(i));
			// String modelName = "";
			while (mModel.find()) {
				modelName = mModel.group(1);
			}
			finalS.append("\n").append(addTab).append("<SHAPE id=\"").append(modelName).append("\" type=\"obj\">");
			addTab.append("\t");
			// GEOMETRY & TEXTUREID
			finalS.append("\n").append(addTab).append("<GEOMETRY id=\"").append(modelName)
					.append("_geo\" uv=\"1.0,1.0\">").append(modelName).append("()</GEOMETRY>");
			finalS.append("\n").append(addTab).append("<TEXTID>").append(modelName).append("_tex</TEXTID>");
			addTab.deleteCharAt(addTab.length() - 1);
			finalS.append("\n").append(addTab).append("</SHAPE>");
		}
		addTab.deleteCharAt(addTab.length() - 1);
		finalS.append("\n").append(addTab).append("</SHAPES>");

		// ROOT
		// <ROOT id="root" skybox="skyTex" skysize="800.0" skyshader="textProg" camera="walk">
		finalS.append("\n").append(addTab).append(
				"<ROOT id=\"root\" skybox=\"skyTex\" skysize=\"800.0\" skyshader=\"textProg\" camera=\"walk\">");
		finalS.append("\n");
		addTab.append("\t");

		// TRANSFORM
		// <TRANSFORM id="transform_ground" translate="0.0,0.0,0.0" rotaxis="0.0,1.0,0.0" angle="0.0" scale="1.0,1.0,1.0">

		Pattern pTrans = Pattern.compile("P: \"Lcl Translation\".*");
		Pattern pRot = Pattern.compile("P: \"Lcl Rotation\".*");
		Pattern pScale = Pattern.compile("P: \"Lcl Scaling\".*");
		for (int i = 0; i < line.size(); i++) {
			Matcher mModel = pmodelName.matcher(line.get(i));
			// String modelName = "";
			while (mModel.find()) {
				modelName = mModel.group(1);
			}

			Matcher mTrans = pTrans.matcher(line.get(i));
			String[] resValuesT = { "0", "0", "0" };
			while (mTrans.find()) {
				String[] resS = mTrans.group(0).split(",");
				resValuesT[0] = resS[resS.length - 3];
				resValuesT[1] = resS[resS.length - 2];
				resValuesT[2] = resS[resS.length - 1];
			}

			Matcher mRot = pRot.matcher(line.get(i));
			String[] resValuesR = { "0", "0", "0" };
			while (mRot.find()) {
				String[] resS = mRot.group(0).split(",");
				resValuesR[0] = resS[resS.length - 3];
				resValuesR[1] = resS[resS.length - 2];
				resValuesR[2] = resS[resS.length - 1];
			}

			Matcher mScale = pScale.matcher(line.get(i));
			String[] resValuesS = { "0", "0", "0" };
			while (mScale.find()) {
				String[] resS = mScale.group(0).split(",");
				resValuesS[0] = resS[resS.length - 3];
				resValuesS[1] = resS[resS.length - 2];
				resValuesS[2] = resS[resS.length - 1];
			}
			StringBuilder addTabFor = new StringBuilder(addTab);
			finalS.append("\n").append(addTabFor).append("<TRANSFORM id=\"transform_").append(modelName).append("\" ")
					.append("translate=\"").append(resValuesT[0]).append(",").append(resValuesT[1]).append(",")
					.append(resValuesT[2]);//"\"";
			StringBuilder endTransform = new StringBuilder();
			endTransform.append("\n").append(addTabFor).append("</TRANSFORM>");
			if (!resValuesR[0].equals("0")) {
				finalS.append("\" rotaxis=\"1.0,0.0,0.0\" angle=\"").append(resValuesR[0]).append("\" ");
			} else {
				finalS.append("\" rotaxis=\"1.0,0.0,0.0\" angle=\"").append(resValuesR[0]).append("\" ");
			}
			finalS.append("scale=\"").append(resValuesS[0]).append(",").append(resValuesS[1]).append(",")
					.append(resValuesS[2]).append("\" ").append(">");
			addTabFor.append("\t");

			if (!resValuesR[1].equals("0")) {
				finalS.append("\n").append(addTabFor).append("<TRANSFORM id=\"transform_").append(modelName)
						.append("_rot_y").append("\" ").append("translate=\"0.0,0.0,0.0\"");
				finalS.append(" rotaxis=\"0.0,1.0,0.0\" angle=\"").append(resValuesR[1]).append("\"")
						.append(" scale=\"0.0,0.0,0.0\" ").append(">");
				endTransform.insert(0, "\n" + addTabFor + "</TRANSFORM>");
				// endTransform = "\n"+addTabFor+"</TRANSFORM>" + endTransform;
				addTabFor.append("\t");
			}
			if (!resValuesR[2].equals("0")) {
				finalS.append("\n").append(addTabFor).append("<TRANSFORM id=\"transform_").append(modelName)
						.append("_rot_x").append("\" ").append("translate=\"0.0,0.0,0.0\"");
				finalS.append("\" rotaxis=\"0.0,0.0,1.0\" angle=\"").append(resValuesR[2]).append("\"")
						.append(" scale=\"0.0,0.0,0.0\" ").append(">");
				endTransform.insert(0, "\n" + addTabFor + "</TRANSFORM>");
				// endTransform = "\n"+addTabFor+"</TRANSFORM>" + endTransform;
				addTabFor.append("\t");
			}

			// OBJECT3D
			// <OBJECT3D id="obj_donjon1Mur" shader="texDiffNormalMapProg">donjon1Mur</OBJECT3D>
			finalS.append("\n").append(addTabFor).append("\t").append("<OBJECT3D id=\"obj_").append(modelName)
					.append("\" shader=\"").append(defaultShader).append("\">").append(modelName).append("</OBJECT3D>");
			finalS.append(endTransform);
			finalS.append("\n");
		}

		finalS.append("\n\t</ROOT>");
		finalS.append("\n</SCENE>");

		writeFile(finalS);

	}

	public static void writeFile(StringBuilder finalS) {
		try {
			PrintWriter writer = new PrintWriter(outputFile, "UTF-8");
			writer.println(finalS);
			writer.close();
		} catch (Exception e) {
			System.out.println("Error while writing");
		}
	}

}
