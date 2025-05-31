/* ************************************************************************** */
/*																			*/
/*														:::	  ::::::::   */
/*   instructions.c									 :+:	  :+:	:+:   */
/*													+:+ +:+		 +:+	 */
/*   By: mmacia <marvin@42.fr>					  +#+  +:+	   +#+		*/
/*												+#+#+#+#+#+   +#+		   */
/*   Created: 2024/07/23 16:08:02 by mmacia			#+#	#+#			 */
/*   Updated: 2024/07/23 16:08:04 by mmacia		   ###   ########.fr	   */
/*																			*/
/* ************************************************************************** */
#include "../header/minishell.h"

void	cd(char *input)
{
	int		i;
	char	*out;

	i = 0;
	while (input[i] != ' ')
		i++;
	while (input[i] == ' ')
		i++;
	if (input[i] == '\0' || input[i + 1] == '\0')
		chdir(getenv("HOME"));
	else if (input[i] == '~')
		chdir(getenv("HOME"));
	else if (input[i] == '.' && input[i + 1] == '.')
		chdir("..");
	else if (input[i] == '/' || ft_isalnum(input[i]))
	{
		out = ft_strdup(input + i);
		if (chdir(out) != 0)
			printf("Chdir : No directories found.\n");
	}
	else
		printf("Chdir : No directories found.\n");
}

void	pwd(void)
{
	char	cwd[4096];

	if (getcwd(cwd, sizeof(cwd)) != NULL)
		printf("%s\n", cwd);
}

char	*name_key(char *input)
{
	int		i;
	int		len;
	char	*key;

	i = 0;
	len = 1;
	while (input[i] != ' ')
		i++;
	while (input[++i])
		len++;
	key = malloc(len * sizeof(char));
	i = 0;
	len = 0;
	while (input[i] != ' ')
		i++;
	while (input[++i])
		key[len++] = input[i];
	key[len] = '\0';
	return (key);
}

t_env_var	*find_var(t_env_var *env, char *key)
{
	while (env)
	{
		if (env->key && *env->key
			&& (ft_strncmp(env->key, key, ft_strlen(key)) == 0))
			break ;
		env = env->next;
	}
	return (env);
}

void	set_var(t_env_var *env, char *key, char *value, bool global)
{
	t_env_var	*var;

	var = find_var(env, key);
	if (var)
	{
		free(var->value);
		var->value = ft_strdup(value);
	}
	else
	{
		add_node(env, ft_strdup(key), ft_strdup(value), global);
	}
}
