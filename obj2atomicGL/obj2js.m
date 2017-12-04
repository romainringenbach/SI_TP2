function js = obj2js(OBJ,nn)
%
% OBJ struct containing:
%
% OBJ.vertices : Vertices coordinates
% OBJ.vertices_texture: Texture coordinates 
% OBJ.vertices_normal : Normal vectors
% OBJ.vertices_point  : Vertice data used for points and lines   
% OBJ.material : Parameters from external .MTL file, will contain parameters like
%           newmtl, Ka, Kd, Ks, illum, Ns, map_Ka, map_Kd, map_Ks,
%           example of an entry from the material object:
%       OBJ.material(i).type = newmtl
%       OBJ.material(i).data = 'vase_tex'
% OBJ.objects  : Cell object with all objects in the OBJ file, 
%           example of a mesh object:
%       OBJ.objects(i).type='f'               
%       OBJ.objects(i).data.vertices: [n x 3 double]
%       OBJ.objects(i).data.texture:  [n x 3 double]
%       OBJ.objects(i).data.normal:   [n x 3 double]
%
%
% author: Remi COZOT - IRISA/University of Rennes 1
% based on code written by D.Kroon University of Twente (June 2010)

    % array for export
    nb_vertices = 0;
    vertices =  [];
    normales = [];
    tex_coord = [];
    indexes = [];

    % duplicate shared vertex with different normals or texture coordinates
    mapV = containers.Map('KeyType','char','ValueType','int32');
    
    % for all object
    for i=1:length(OBJ.objects)
        % debug
        % disp(strcat('compiling object:',num2str(i)));
        type=OBJ.objects(i).type;
        data=OBJ.objects(i).data;
        switch(type)
            case 'usemtl'
                % debug
                % disp(strcat('usemtl:','na'));
            case 'f'
                % debug
                % disp(strcat('f:','face'));
                check1=(isfield(OBJ,'vertices_texture')&&~isempty(OBJ.vertices_texture));
                check2=(isfield(OBJ,'vertices_normal')&&~isempty(OBJ.vertices_normal));
                if(check1&&check2)
                    % vertice  + texture + normal
                    % disp('vertice + texture + normal ');
                    for j=1:size(data.vertices,1) 
                        for k=1:3
                          % build key
                            vkey = strcat(num2str(data.vertices(j,k)),'/',num2str(data.texture(j,k)),'/',num2str(data.normal(j,k)));
                            % debug
                            % disp(strcat('key:',vkey,'--------------'));
                            % test key
                            if isKey(mapV,vkey)
                                % key already present
                                % recover index
                                id = mapV(vkey);
                                indexes(end+1) = id ;
                                % debug ;
                                %disp(strcat(vkey,' - shared vertice:','index:',num2str(id)));
                            else
                                % new vertice
                                nb_vertices = nb_vertices +1 ;
                                mapV(vkey) = nb_vertices;
                                % vertex
                                v = OBJ.vertices(data.vertices(j,k),:);
                                % tex coord
                                t = OBJ.vertices_texture(data.texture(j,k),:);
                                % normal
                                n = OBJ.vertices_normal(data.normal(j,k),:);
                                % add vertex, tex coord, normal
                                vertices(nb_vertices,:)= [v(1),v(2),v(3)];
                                tex_coord(nb_vertices,:)= [t(1),t(2)];
                                normales(nb_vertices,:)= [n(1),n(2),n(3)];
                                % add the index
                                indexes(end+1) = nb_vertices ;
                                % debug
                               % disp(strcat(vkey,' - new vertice: (', ...
                               %     num2str(v(1)),',', ...
                               %     num2str(v(2)),',', ...
                               %     num2str(v(3)),') -> index:',...
                               %     num2str(nb_vertices) ...
                               % ));
                            end % end if
                        end % end for k
                    end % end for j
                elseif(check1)
                    for j=1:size(data.vertices,1)
                        %vertice + texture
                            for k=1:3
                            %disp('vertice + texture');
                            % build key
                                vkey = strcat(num2str(data.vertices(j,k)),'/',num2str(data.texture(j,k)));
                                % debug
                                %disp(strcat('vertice description:',vkey));
                            end                        
                    end
                elseif(check2)
                    for j=1:size(data.vertices,1)
                        % vertice + normal
                            for k=1:3
                            %disp('vertice + normal');
                            % build key
                                vkey = strcat(num2str(data.vertices(j,k)),'//',num2str(data.normal(j,k)));
                                % debug
                                %disp(strcat('vertice description:',vkey));
                            end  
                    end
                else
                    for j=1:size(data.vertices,1)
                        % vertice alone
                            for k=1:3
                            %disp('vertice');
                            % build key
                                vkey = num2str(data.vertices(j,k));
                                % debug
                                %disp(strcat('vertice description:',vkey));
                            end                          
                    end
                end
%            otherwise
%            fprintf(fid,'%s ',type);
%            if(iscell(data))
%                for j=1:length(data)
%                     if(ischar(data{j}))
%                         disp(fid,'%s ',data{j});
%                     else
%                         fprintf(fid,'%0.5g ',data{j});
%                     end
%                end 
%            elseif(ischar(data))
%                fprintf(fid,'%s ',data);
%            else
%                for j=1:length(data)
%                    fprintf(fid,'%0.5g ',data(j));
%                end      
%            end
%            fprintf(fid,'\n');
        end
    end 
    
    % output
    js.name = nn ;
    js.vertices = vertices ;
    js.tex_coord = tex_coord ;
    js.normales = normales ;
    js.indexes = indexes ;
    
    





