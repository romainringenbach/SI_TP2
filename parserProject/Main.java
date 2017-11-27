import java.io.FileReader;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.*;

public class Main {
	
	public static void main(String args[]) {
		
        // The name of the file to open.
        String fileName = "C:\\Users\\Biscotteman\\Desktop\\stuff.fbx";

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
			Pattern patt = Pattern.compile("Model: [0-9]*, \"Model::\\w*\", \"Mesh\" \\{([^}]*)\\}");
    		Matcher m = patt.matcher(line);
    		ArrayList<String> res = new ArrayList<String>();
    		while(m.find()) {
    			res.add(m.group(0));
    		}
    		fillList(res);
    	}
 
    	
    	public static void fillList(ArrayList<String> line) {
    		Pattern pmodelName = Pattern.compile("Model::[^,\"]*");
    		Pattern pTrans = Pattern.compile("P: \"Lcl Translation\".*");
    		Pattern pRot = Pattern.compile("P: \"Lcl Rotation\".*");
    		Pattern pScale = Pattern.compile("P: \"Lcl Scaling\".*");
    		for(int i = 0; i < line.size(); i++) {
	    		Matcher mModel = pmodelName.matcher(line.get(i));
	    		String modelName = "";
	    		while(mModel.find()) {
	    			modelName = mModel.group(0);
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
	    		String finalS = "<TRANSFORM id=\"transform_"+modelName+"\" "+
	    				"translate=\""+resValuesT[0]+","+resValuesT[1]+","+resValuesT[2]+"\""+
	    			//	"\" translate=\""+resValuesT[0]+","+resValuesT[1]+","+resValuesT[2]+"\" "+	TODO ROTATION
	    				"scale=\""+resValuesS[0]+","+resValuesS[1]+","+resValuesS[2]+"\" "+
	    				">";
	    		// TODO : Ajouter les lignes OBJECT3D
	    		System.out.println(finalS);
    		}
    	}
}
	
