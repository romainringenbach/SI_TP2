function write_js(OBJ,fullfilename)
% Write atomicObj
%
% write_js(OBJ,filename);
%
% OBJ struct containing:
%     js.name       = string
%     js.vertices = vertices n x 3
%     js.tex_coord = tex_coord n x 2
%     js.normales = normales n x 3
%     js.indexes = indexes m
%
% author: Remi COZOT - IRISA/University of Rennes 1

if(exist('fullfilename','var')==0)
    [filename, filefolder] = uiputfile('*.js', 'Write atomicObj-file');
    fullfilename = [filefolder filename];
end
[filefolder,filename] = fileparts( fullfilename);

head={};
head{1}='// Obj 2 atomicGL exporter ';
head{2}='// author: Remi COZOT - IRISA/University of Rennes 1';
head{3}=strcat(OBJ.name,'=function(){');
head{4}='this.vertices =[';

% vertices
vt = {};
for i=1:(length(OBJ.vertices)-1)
    % write vertice
    v = OBJ.vertices(i,:);
    vt{i} = strcat('  ',num2str(v(1)),',',num2str(v(2)),',',num2str(v(3)),', // vertice ',num2str(i-1));
end
v = OBJ.vertices(length(OBJ.vertices),:);
vt{end+1} = strcat('  ',num2str(v(1)),',',num2str(v(2)),',',num2str(v(3)),' // vertice ',num2str(length(OBJ.vertices)-1));
vt{end+1} = ']' ;
vt{end+1} = 'this.normals = [' ;

% normals
vn = {};
for i=1:(length(OBJ.vertices)-1)
    % write vertice
    v = OBJ.normales(i,:);
    vn{i} = strcat('  ',num2str(v(1)),',',num2str(v(2)),',',num2str(v(3)),', // normal ',num2str(i-1));
end
v = OBJ.normales(length(OBJ.normales),:);
vn{end+1} = strcat('  ',num2str(v(1)),',',num2str(v(2)),',',num2str(v(3)),' // normal ',num2str(length(OBJ.normales)-1));
vn{end+1} = ']' ;
vn{end+1} = 'this.uv = [' ;

% tex coord
vu = {};
for i=1:(length(OBJ.tex_coord)-1)
    % write vertice
    v = OBJ.tex_coord(i,:);
    vu{i} = strcat('  ',num2str(v(1)),',',num2str(v(2)),', // uv ',num2str(i-1));
end
v = OBJ.tex_coord(length(OBJ.tex_coord),:);
vu{end+1} = strcat('  ',num2str(v(1)),',',num2str(v(2)),' // uv ',num2str(length(OBJ.tex_coord)-1));
vu{end+1} = ']' ;
vu{end+1} = 'this.index=[' ;

% index
vi = {};
for i=1:(length(OBJ.indexes)-1)
    % write vertice
    v = OBJ.indexes(i)-1;
    vi{i} = strcat('  ',num2str(v),',');
end
v = OBJ.indexes(length(OBJ.indexes))-1;
vi{end+1} = strcat('  ',num2str(v));
vi{end+1} = ']' ;
vi{end+1} = '}' ;

% write file
fid = fopen(fullfilename,'w');
write_txt(fid,head);
write_txt(fid,vt);
write_txt(fid,vn);
write_txt(fid,vu);
write_txt(fid,vi);
fclose(fid);

% write in file
function write_txt(fid,txts)
for i=1:length(txts), fprintf(fid,'%s\n',txts{i}); end






