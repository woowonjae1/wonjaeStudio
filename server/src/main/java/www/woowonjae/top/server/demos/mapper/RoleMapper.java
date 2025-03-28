package www.woowonjae.top.server.demos.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import www.woowonjae.top.server.demos.model.Role;

@Mapper
public interface RoleMapper {
    @Select("SELECT * FROM roles WHERE name = #{name}")
    Role findByName(String name);

    @Insert("INSERT INTO user_roles(user_id, role_id) VALUES(#{userId}, #{roleId})")
    int addRoleToUser(@Param("userId") Long userId, @Param("roleId") Long roleId);
}