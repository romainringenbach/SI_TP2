# Converti un fihier .obj en .js et place ce dernier au même endroit

# pour charger dans la console python :  exec(open("path/objtojs.py").read())
# pour convertire un obj : convertFile("path/name.obj")
from os import listdir
from os.path import isfile, join




def convertFiles(path):
    files = listdir(path)
    if path[len(path)-1:len(path)] != "/":
        path = path + '/'
    for afile in files:
        if afile[len(afile)-4:len(afile)] == ".obj" :
            convertFile(path+afile)

def convertFile(path):

    obj = open(path,"r")
    fileString = obj.read()
    obj.close()

    arrayLines = fileString.split('\n')

    name = ''

    current_mtl = 0

    mtl = []

    v = []
    vn = []
    vt = []
    f = []

    # 0(n)  (n mots)

    # Get all data for treatement
    for line in arrayLines :
        arrayLine = line.split(' ')
        if arrayLine[0] == 'o':
            name = arrayLine[1]
        if arrayLine[0] == 'usemtl':
            if arrayLine[1] in mtl:
                current_mtl = mtl.index(arrayLine[1]) +1
            else:
                mtl.append(arrayLine[1])
                current_mtl = len(mtl)
        if arrayLine[0] == 'f':

            tri = []

            if len(arrayLine) == 4 or (len(arrayLine) == 5 and arrayLine[4] == ''):
                for value in arrayLine[1:len(arrayLine)]:

                    fData = value.split('/')

                    ver = ()

                    if fData[1] == '':
                        ver = (int(fData[0]),-1,int(fData[2]))
                    else:
                        ver = (int(fData[0]),int(fData[1]),int(fData[2]))

                    tri.append(ver)

                tri.append(current_mtl)
                f.append(tri)

            elif len(arrayLine) == 5:
                for value in arrayLine[1:len(arrayLine)-1]:

                    fData = value.split('/')

                    ver = ()

                    if fData[1] == '':
                        ver = (int(fData[0]),-1,int(fData[2]))
                    else:
                        ver = (int(fData[0]),int(fData[1]),int(fData[2]))

                    tri.append(ver)

                tri.append(current_mtl)
                f.append(tri)
                tri = []

                tmp = [arrayLine[1],arrayLine[3],arrayLine[4]]

                for value in tmp:

                    fData = value.split('/')

                    ver = ()

                    if fData[1] == '':
                        ver = (int(fData[0]),-1,int(fData[2]))
                    else:
                        ver = (int(fData[0]),int(fData[1]),int(fData[2]))

                    tri.append(ver)

                tri.append(current_mtl)
                f.append(tri)





        if arrayLine[0] == 'vn':
            vn.append((float(arrayLine[1]),float(arrayLine[2]),float(arrayLine[3])))
        if arrayLine[0] == 'v':
            v.append((float(arrayLine[1]),float(arrayLine[2]),float(arrayLine[3])))
        if arrayLine[0] == 'vt':
            vt.append((float(arrayLine[1]),float(arrayLine[2])))

    if name == '' or '.' in name:

        name = path[0:len(path)-4]
        if path[0] == '.':
            name = path[2:len(path)-4]




    if len(mtl) != 0:
        i = 1
        for m in mtl:
            tmp_f = []
            for one_f in f:
                if one_f[3] == i:
                    tmp_f.append(one_f[0:3])

            if '#' in m:
                j = m.index('#')
                tmp_m = list(m)
                tmp_m[j] = '_'
                m = ''.join(tmp_m)

            create_js(vn,v,vt,tmp_f,name,m,i,path)

            i = i + 1
    else:
        for one_f in f:
            del one_f[-1]
        create_js(vn,v,vt,f,name,"none",0,path)


def create_js(vn,v,vt,f,name,mtl,no_mtl,path):

    #Treat new list

    vertices = []
    normals = []
    uv = []
    index = []

    vertex_index = {}
    last_index = 0;
    for face in f:
        for vertex in face:
            if vertex in vertex_index.keys():
                index.append(vertex_index[vertex])
            else:
                vertex_index[vertex] = last_index;
                index.append(last_index)
                last_index += 1

                # Add vertice

                vertice = v[vertex[0]-1]
                vertices.append(vertice)


                # Add normals

                normal = vn[vertex[2]-1]
                normals.append(normal)

                # Add uv

                ct = vt[vertex[1]-1]
                uv.append(ct)
                #print(last_index)


    newpath = path[0:len(path)-4] +"_"+str(no_mtl)+".js"

    js = open(newpath,"w")

    js.write(name+"_"+mtl+" = function(){"+"\r\n")
    js.write("//"+mtl+"\r\n")

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
