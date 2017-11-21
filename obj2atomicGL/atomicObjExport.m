function atomicObjExport( objfile,name)
% atomicObjExportatomicObjExport
%   objfile     : string -  obj file name
%   name        : string -  javascript object name
m = read_wobj(objfile);
j = obj2js(m,name);
write_js(j,strcat(name,'.js'));
end

