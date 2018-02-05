from PIL import Image
import math

def processNormalMap(im):

    #im.size = (width,height)
    pixelgrid = im.load()

    norm = Image.new("RGB", (im.size[0], im.size[1]), "white")
    pixelgridNormal = norm.load()

    for x in range(0,im.size[0]):
        for y in range(0,im.size[1]):
            grcx = (0,0,0)
            grcy = (0,0,0)

            if x >= 1 and x < im.size[0]-1:
                grcx = ((pixelgrid[x+1,y][0]-pixelgrid[x-1,y][0])/2.0,(pixelgrid[x+1,y][1]-pixelgrid[x-1,y][1])/2.0,(pixelgrid[x+1,y][2]-pixelgrid[x-1,y][2])/2.0)
            else:
                if x < im.size[0]-1:
                    grcx =  ((pixelgrid[x+1,y][0]-pixelgrid[x,y][0]),(pixelgrid[x+1,y][1]-pixelgrid[x,y][1]),(pixelgrid[x+1,y][2]-pixelgrid[x,y][2]))
                else:
                    grcx =  ((pixelgrid[x,y][0]-pixelgrid[x-1,y][0]),(pixelgrid[x,y][1]-pixelgrid[x-1,y][1]),(pixelgrid[x,y][2]-pixelgrid[x-1,y][2]))

            if y>=1 and y < im.size[1]-1:
                grcy = ((pixelgrid[x,y+1][0]-pixelgrid[x,y-1][0])/2.0,(pixelgrid[x,y+1][1]-pixelgrid[x,y-1][1])/2.0,(pixelgrid[x,y+1][2]-pixelgrid[x,y-1][2])/2.0)
            else:
                if y < im.size[1]-1:
                    grcy =  ((pixelgrid[x,y+1][0]-pixelgrid[x,y][0]),(pixelgrid[x,y+1][1]-pixelgrid[x,y][1]),(pixelgrid[x,y+1][2]-pixelgrid[x,y][2]))
                else:
                    grcy =  ((pixelgrid[x,y][0]-pixelgrid[x,y-1][0]),(pixelgrid[x,y][1]-pixelgrid[x,y-1][1]),(pixelgrid[x,y][2]-pixelgrid[x,y-1][2]))

            dzdx = (grcx[0]/255.0 + grcx[1]/255.0 + grcx[2]/255.0)
            dzdy = (grcy[0]/255.0 + grcy[1]/255.0 + grcy[2]/255.0)


            direction = (dzdx,dzdy,math.fabs(math.sqrt(1.0-math.pow(dzdx,2)-math.pow(dzdy,2))))



            normal = (direction[0],direction[1],direction[2])


            #normal = (
            #normalx[1]*normaly[2]-normalx[2]*normaly[1],
            #normalx[2]*normaly[0]-normalx[0]*normaly[2],
            #abs(normalx[0]*normaly[1]-normalx[1]*normaly[0])
            #)

            print(direction)
            print(magnitude)

            normalcolor = (
            int(round((normal[0]+1.0)*128.0)),
            int(round((normal[1]+1.0)*128.0)),
            int(round(normal[2]*128.0))+128
            )

            pixelgridNormal[x,y] = normalcolor

    return norm

def processDepthMap(im):
    pixelgrid = im.load()
    depth = Image.new("RGB", (im.size[0], im.size[1]), "white")
    pixelgridDepth = depth.load()

    maximumIntensity = 0.0

    for x in range(0,im.size[0]):
        for y in range(0,im.size[1]):
            intensity = max(pixelgrid[x,y])
            pixelgridDepth[x,y] = (intensity,intensity,intensity)
            if maximumIntensity < intensity:
                maximumIntensity = intensity

    diff = 255 - maximumIntensity

    for x in range(0,im.size[0]):
        for y in range(0,im.size[1]):
            v = pixelgridDepth[x,y]
            d = (255 - v[1]) - diff
            pixelgridDepth[x,y] = (d,d,d)

    return depth


def normalMap(path):
    I = Image.open(path)
    norm = processNormalMap(I)
    newpath = path[0:len(path)-5] + "NormalMap" + path[len(path)-5:len(path)]
    norm.save(newpath)

def depthMap(path):
    I = Image.open(path)
    norm = processDepthMap(I)
    newpath = path[0:len(path)-5] + "DepthMap" + path[len(path)-5:len(path)]
    norm.save(newpath)
