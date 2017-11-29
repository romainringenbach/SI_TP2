# Converti un fihier .obj en .js et place ce dernier au même endroit

# pour charger dans la console python :  exec(open("path/objtojs.py").read())
# pour convertire un obj : convert("path/name.obj")

def convert(path):

    obj = open(path,"r")
    fileString = obj.read()
    obj.close()

    arrayLines = fileString.split('\n')

    name = ''

    v = []
    vn = []
    vt = []

    indexcount = 0
    indexdic = {}

    # Get all data for treatement
    for line in arrayLines :
        arrayLine = line.split(' ')
        if arrayLine[0] == 'o':
            name = arrayLine[1]
        if arrayLine[0] == 'f':

            for value in arrayLine[1:len(arrayLine)]:

                fData = value.split('/')

                key = ()

                if fData[1] == '':
                    key = (int(fData[0]),-1,int(fData[2]))
                else:
                    key = (int(fData[0]),int(fData[1]),int(fData[2]))

                if key in indexdic.keys():
                    indexdic[key].append(indexcount)
                else:
                    indexdic[key] = [indexcount]

            indexcount += 1

        if arrayLine[0] == 'vn':
            vn.append((float(arrayLine[1]),float(arrayLine[2]),float(arrayLine[3])))
        if arrayLine[0] == 'v':
            v.append((float(arrayLine[1]),float(arrayLine[2]),float(arrayLine[3])))
        if arrayLine[0] == 'vt':
            vt.append((float(arrayLine[1]),float(arrayLine[2])))

    #Treat new list

    vertices = []
    normals = []
    uv = []
    index = []

    valuesindex = {}
    valuesindexcount = 0

    for i in range(0,indexcount):
        t = []
        tindex = []
        # Find the tree group of value that define a triangle

        for key in indexdic.keys():
            if i in indexdic[key]:
                t.append(key)

        # Give a index to each group, add their values in the ordre to each array
        for ts in t:
            if ts in valuesindex.keys():
                tindex.append(valuesindex[ts])
            else:
                valuesindex[ts] = valuesindexcount
                tindex.append(valuesindexcount)

                # Add vertice

                vertice = v[ts[0]-1]
                vertices.append(vertice)


                # Add normals

                normal = vn[ts[2]-1]
                normals.append(normal)

                # Add uv

                if ts[1] != -1:
                    ct = vt[ts[1]-1]
                    uv.append(ct)


                valuesindexcount += 1


        # Add their index to index

        for j in tindex:
            index.append(j)

        newpath = path[0:len(path)-3] + "js"

        js = open(newpath,"w")

        js.write(name+" = function(){"+"\r\n")


        #vertices
        js.write("this.vertices = ["+"\r\n")
        verticecount = 0
        for vertice in vertices:
            if verticecount < len(vertices)-1:
                js.write(str(vertice[0])+","+str(vertice[1])+","+str(vertice[2])+", // vertice"+str(verticecount)+"\r\n")
            else:
                js.write(str(vertice[0])+","+str(vertice[1])+","+str(vertice[2])+" // vertice"+str(verticecount)+"\r\n")
            verticecount += 1

        js.write("];"+"\r\n")

        #normals
        js.write("this.normals = ["+"\r\n")
        normalcount = 0
        for normal in normals:
            if normalcount < len(normals)-1:
                js.write(str(normal[0])+","+str(normal[1])+","+str(normal[2])+", // normal"+str(normalcount)+"\r\n")
            else:
                js.write(str(normal[0])+","+str(normal[1])+","+str(normal[2])+" // normal"+str(normalcount)+"\r\n")
            normalcount += 1

        js.write("];"+"\r\n")

        #uv
        js.write("this.uv = ["+"\r\n")
        uvcount = 0
        for uv_ele in uv:
            if uvcount < len(uv)-1:
                js.write(str(uv_ele[0])+","+str(uv_ele[1])+", // uv"+str(uvcount)+"\r\n")
            else:
                js.write(str(uv_ele[0])+","+str(uv_ele[1])+" // uv"+str(uvcount)+"\r\n")
            uvcount += 1

        js.write("];"+"\r\n")

        #index
        js.write("this.index = ["+"\r\n")
        indexcount = 0
        for i in index:
            if indexcount < len(index)-1:
                js.write(str(i)+","+"\r\n")
            else:
                js.write(str(i)+"\r\n")
        js.write("];"+"\r\n")


        js.write("}")


        js.close()