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
		if(args.length==0) {
			System.out.println("Using default values for directories and default shader.");
			System.out.println("Textures directory : "+texturesDirectory);
			System.out.println("Output file : "+outputFile);
			System.out.println("File name : "+fileName);
		}
		else {
			try{
				fileName = args[0];
				outputFile = args[1];
				texturesDirectory = args[2];
				defaultShader = args[3];
			}
			catch(Exception e) {
				System.out.println("Not enough arguments.");
				System.out.println("use : Main <fileName> <output> <texturesDirectory> <defaultShader>");
				return;
			}
		}

        // This will reference one line at a time
        String line = null;

        try {
            // FileReader reads text files in the default encoding.
            FileReader fileReader = 
                new FileReader(fileName);

            // Always wrap FileReader in BufferedReader.
            BufferedReader bufferedReader = 
                new BufferedReader(fileReader);
            String all= "";
            while((line = bufferedReader.readLine()) != null) {
            	 all += line + "\n";
            }   
            checkText(all);
            // Always close files.
            bufferedReader.close();         
        }
        catch(Exception ex) {
            ex.printStackTrace();         
        }
	}

	
    	public static void checkText(String line) {
    		// TODO LIGHTS
			Pattern patt = Pattern.compile("Model: [0-9]*, \"Model::[^,]*, \"(Mesh)\" \\{([^}]*)\\}");
    		Matcher m = patt.matcher(line);
    		ArrayList<String> res = new ArrayList<String>();
    		while(m.find()) {
    			res.add(m.group(0));
    		}
    		fillList(res);
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
    		String finalS = "";
    		String addTab = "";
    		// HEADER
    		finalS += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    		
    		// SCENE
    		finalS += "\n"+addTab+"<SCENE>";
    		addTab+="\t";
    		
    		// SHADERS
    		finalS+= "\n"+addTab+"<SHADERS>";
    		addTab+="\t";
    		finalS+="\n"+addTab+"<XMATSHADER file=\"shaders/texProg.xml\" nbtex=\"1\" nblight=\"0\">textProg</XMATSHADER>"
    				+"\n"+addTab+"<XMATSHADER file=\"shaders/texDiffProg.xml\" nbtex=\"1\" nblight=\"1\">texDiffProg</XMATSHADER>"
    				+"\n"+addTab+"<XMATSHADER file=\"shaders/texNormalMapProg.xml\" nbtex=\"2\" nblight=\"1\">texDiffNormalMapProg</XMATSHADER>"
    				+"\n"+addTab+"<XMATSHADER file=\"shaders/texPhongProg.xml\" nbtex=\"2\" nblight=\"1\">texPhongProg</XMATSHADER>"
    				+"\n"+addTab+"<XMATSHADER file=\"shaders/shaderToon.xml\" nbtex=\"1\" nblight=\"1\">cartoon</XMATSHADER>"
    				+"\n"+addTab+"<XMATSHADER file=\"shaders/shaderBaWMovie.xml\" nbtex=\"1\" nblight=\"1\">blackAndWhiteMovie</XMATSHADER>"
    				+"\n"+addTab+"<XMATSHADER file=\"shaders/shaderBaW.xml\" nbtex=\"1\" nblight=\"1\">blackAndWhite</XMATSHADER>";
    		addTab = addTab.substring(0, addTab.length()-1);
    		finalS+="\n"+addTab+"</SHADERS>";
    		
    		// LIGHTS
    		// TODO : CHECK FBX TO SEE HOW LIGHTS ARE HANDLED
    		finalS+= "\n"+addTab+"<LIGHTS>";
    		addTab+="\t";
    		finalS+="\n"+addTab+"<LIGHT id=\"sun\" position=\"1000.0,500.0,500.0\" color=\"1.0,0.8,0.8\">light1</LIGHT>";
    		addTab = addTab.substring(0, addTab.length()-1);
    		finalS+="\n"+addTab+"</LIGHTS>";
    		
    		// TEXTURES
    		finalS+= "\n"+addTab+"<TEXTURES>";
    		addTab+="\t";
    		ArrayList<String> textures = getTexturesNames();
    		for(String nameT : textures) {
    			String type = "color";
    			String idT = nameT.substring(0, nameT.length()-4);
    			if(nameT.contains("normal")) {
    				type = "normal";
    			}
    			finalS+="\n"+addTab+"<TEXTURE id=\""+idT+"\" type=\""+type+"\">texture/"+nameT+"</TEXTURE>";
    		}
    		addTab = addTab.substring(0, addTab.length()-1);
    		finalS+="\n"+addTab+"</TEXTURES>";
    		
    		// SHAPES
    		finalS+="\n"+addTab+"<SHAPES>";
    		addTab+="\t";
    		Pattern pmodelName = Pattern.compile("Model::([^,\"]*)");
    		for(int i = 0; i < line.size(); i++) {
	    		Matcher mModel = pmodelName.matcher(line.get(i));
	    		String modelName = "";
	    		while(mModel.find()) {
	    			modelName = mModel.group(1);
	    		}
	    		finalS+="\n"+addTab+"<SHAPE id=\""+modelName+"\" type=\"obj\">";
	    		addTab+="\t";
	    		// GEOMETRY & TEXTUREID
	    		finalS+="\n"+addTab+"<GEOMETRY id=\""+modelName+"_geo\" uv=\"1.0,1.0\">"+modelName+"()</GEOMETRY>";
	    		finalS+="\n"+addTab+"<TEXTID>"+modelName+"_tex</TEXTID>";
	    		addTab = addTab.substring(0, addTab.length()-1);
	    		finalS+="\n"+addTab+"</SHAPE>";
    		}
    		addTab = addTab.substring(0, addTab.length()-1);
    		finalS+="\n"+addTab+"</SHAPES>";
    		
    		// ROOT
    		// <ROOT id="root" skybox="skyTex" skysize="800.0" skyshader="textProg" camera="walk">
    		finalS += "\n"+addTab+"<ROOT id=\"root\" skybox=\"skyTex\" skysize=\"800.0\" skyshader=\"textProg\" camera=\"walk\">";
    		finalS += "\n";
    		addTab+="\t";
    		    		
    		// TRANSFORM
    		// <TRANSFORM id="transform_ground" translate="0.0,0.0,0.0" rotaxis="0.0,1.0,0.0" angle="0.0" scale="1.0,1.0,1.0">
    		
    		Pattern pTrans = Pattern.compile("P: \"Lcl Translation\".*");
    		Pattern pRot = Pattern.compile("P: \"Lcl Rotation\".*");
    		Pattern pScale = Pattern.compile("P: \"Lcl Scaling\".*");
    		for(int i = 0; i < line.size(); i++) {
	    		Matcher mModel = pmodelName.matcher(line.get(i));
	    		String modelName = "";
	    		while(mModel.find()) {
	    			modelName = mModel.group(1);
	    		}
	    		
	    		Matcher mTrans = pTrans.matcher(line.get(i));
	    		String[] resValuesT = {"0","0","0"};
	    		while(mTrans.find()) {
	    			String[] resS = mTrans.group(0).split(",");
	    			resValuesT[0] = resS[resS.length-3];
	    			resValuesT[1] = resS[resS.length-2];
	    			resValuesT[2] = resS[resS.length-1];
	    		}
	    		
	    		Matcher mRot = pRot.matcher(line.get(i));
	    		String[] resValuesR = {"0","0","0"};
	    		while(mRot.find()) {
	    			String[] resS = mRot.group(0).split(",");
	    			resValuesR[0] = resS[resS.length-3];
	    			resValuesR[1] = resS[resS.length-2];
	    			resValuesR[2] = resS[resS.length-1];
	    		}
	    		
	    		Matcher mScale = pScale.matcher(line.get(i));
	    		String[] resValuesS = {"0","0","0"};
	    		while(mScale.find()) {
	    			String[] resS = mScale.group(0).split(",");
	    			resValuesS[0] = resS[resS.length-3];
	    			resValuesS[1] = resS[resS.length-2];
	    			resValuesS[2] = resS[resS.length-1];
	    		}
	    		String addTabFor = addTab;
	    		finalS += "\n"+addTabFor+"<TRANSFORM id=\"transform_"+modelName+"\" "+
	    				"translate=\""+resValuesT[0]+","+resValuesT[1]+","+resValuesT[2];//"\"";
	    		String endTransform = "\n"+addTabFor+"</TRANSFORM>";
	    		if(!resValuesR[0].equals("0")){
	    			finalS += "\" rotaxis=\"1.0,0.0,0.0\" angle=\""+resValuesR[0]+"\" ";
	    		}
	    		else {
	    			finalS += "\" rotaxis=\"1.0,0.0,0.0\" angle=\""+resValuesR[0]+"\" ";
	    		}
	    		finalS += "scale=\""+resValuesS[0]+","+resValuesS[1]+","+resValuesS[2]+"\" "+
	    					">";
	    		addTabFor+="\t";
	    		
	    		if(!resValuesR[1].equals("0")){
	    			
	    			finalS += "\n"+addTabFor+"<TRANSFORM id=\"transform_"+modelName+"_rot_y"+"\" "+
		    				"translate=\"0.0,0.0,0.0\"";
	    			finalS += " rotaxis=\"0.0,1.0,0.0\" angle=\""+resValuesR[1]+"\"";
	    			finalS += " scale=\"0.0,0.0,0.0\" "+
	    					">";
	    			endTransform = "\n"+addTabFor+"</TRANSFORM>" + endTransform;
	    			addTabFor += "\t";
	    		}
	    		if(!resValuesR[2].equals("0")){
	    			finalS += "\n"+addTabFor+"<TRANSFORM id=\"transform_"+modelName+"_rot_x"+"\" "+
		    				"translate=\"0.0,0.0,0.0\"";
	    			finalS += "\" rotaxis=\"0.0,0.0,1.0\" angle=\""+resValuesR[2]+"\"";
	    			finalS += " scale=\"0.0,0.0,0.0\" "+
	    					">";
	    			endTransform = "\n"+addTabFor+"</TRANSFORM>" + endTransform;
	    			addTabFor += "\t";
	    		}
	    		
	    		// OBJECT3D
	    		// <OBJECT3D id="obj_donjon1Mur" shader="texDiffNormalMapProg">donjon1Mur</OBJECT3D>
	    		finalS += "\n"+addTabFor+"\t"+"<OBJECT3D id=\"obj_"+modelName+"\" shader=\""+defaultShader+"\">"
	    				+ modelName + "</OBJECT3D>";
	    		finalS += endTransform;
	    		finalS += "\n";
    		}
    		
    		finalS += "\n\t</ROOT>";
    		finalS += "\n</SCENE>";
    		
    		writeFile(finalS);
    		
    	}
    	
    	public static void writeFile(String finalS) {
    		try {
	    		PrintWriter writer = new PrintWriter(outputFile, "UTF-8");
	    		writer.println(finalS);
	    		writer.close();
    		}catch (Exception e) {
    			System.out.println("Error while writing");
    		}
    	}
    	
}
	
